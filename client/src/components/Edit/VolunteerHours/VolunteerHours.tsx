import React, { useEffect, forwardRef } from 'react';

import MaterialTable, { EditComponentProps, Query } from 'material-table';
import {
  Grid,
  Divider,
  FormControl,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  DatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useParams, useHistory } from 'react-router-dom';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
  Refresh,
  AccessTime
} from '@material-ui/icons';

import PageBase from '../../../hoc/PageBase/PageBase';
import { Select, Button } from '../../../shared/Input';
import { ApiService } from '../../../shared/Services';
import { ApiEndpoints } from '../../../shared/Constants';
import { useStore } from '../../../store';
import { SnackbarActions } from '../../../store/Actions';
import { IVolunteer, IDepartment } from '../../../shared/Interfaces';

interface IRow {
  id: number;
  date: string;
  department: number;
  timeIn: string;
  timeOut: string;
  multiplier: number;
  comments: string | undefined;
}

interface IState {
  volunteer: Partial<IVolunteer>;
  departments: IDepartment[];
  selectedDepartment: number | undefined;
  initialDateTime: string | undefined;
  earnedHours: number;
  actualHours: number;
  feathersEarned: number;
  ticketsEarned: number;
  aboveAndBeyondEarned: number;
}

const useFormControlStyles = makeStyles({
  root: {
    width: '100%'
  }
});

const useTextFieldStyles = makeStyles({
  root: {
    width: '175px'
  }
});

const VolunteerHours: React.FC = props => {
  const initialDateTime = () => {
    return new Date().toISOString();
  };
  const formControlStyles = useFormControlStyles();
  const textFieldStyles = useTextFieldStyles();
  const [state, setState] = React.useState<IState>({
    volunteer: {},
    departments: [],
    selectedDepartment: undefined,
    initialDateTime: initialDateTime(),
    earnedHours: 0,
    actualHours: 0,
    feathersEarned: 0,
    ticketsEarned: 0,
    aboveAndBeyondEarned: 0
  });

  let multiplier: number;

  const history = useHistory();
  const globalState = useStore();
  const ctx = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };
  const tableRef = React.createRef<any>();
  const { id } = useParams();
  let selectOptions: object[] = [];
  const tableColumns = [
    {
      title: 'Date',
      field: 'date',
      render: (renderData: any) => {
        const dateOptions = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        };
        const date = new Date(renderData?.date);

        return date.toLocaleDateString('en-US', dateOptions);
      },
      initialEditValue: new Date().toISOString(),
      editComponent: (props: EditComponentProps<IRow>) => (
        <DateComponent {...props} />
      )
    },
    {
      title: 'Department',
      field: 'department',
      editComponent: (props: EditComponentProps<IRow>) => (
        <SelectComponent {...props} />
      ),
      render: (rowData: IRow) => {
        const department: IDepartment | undefined = state.departments.find(
          (department: IDepartment) => rowData.department === department.id
        );

        return department?.name;
      }
    },
    {
      title: 'Time In',
      field: 'timeIn',
      render: (renderData: any) => {
        const timeOptions = {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        };
        const time = new Date(renderData?.timeIn);

        return time.toLocaleTimeString('en-US', timeOptions);
      },
      initialEditValue: new Date().toISOString(),
      editComponent: (props: EditComponentProps<IRow>) => (
        <TimeComponent {...props} />
      )
    },
    {
      title: 'Time Out',
      field: 'timeOut',
      render: (renderData: any) => {
        const timeOptions = {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        };
        const time = new Date(renderData?.timeOut);

        return time.toLocaleTimeString('en-US', timeOptions);
      },
      initialEditValue: new Date().toISOString(),
      editComponent: (props: EditComponentProps<IRow>) => (
        <TimeComponent {...props} />
      )
    },
    {
      title: 'Multiplier',
      field: 'multiplier',
      editComponent: (props: EditComponentProps<IRow>) => {
        // This is an ugly little hack to help update this field
        // when selecting a department or changing the value manually.
        if (!multiplier) {
          multiplier = props.value;
        }
        return (
          <TextField
            value={multiplier || ''}
            onChange={e => {
              const value = parseInt(e.target.value);
              props.onChange(value);

              multiplier = value;
            }}
          />
        );
      }
    },
    { title: 'Comments', field: 'comments' }
  ];

  if (state.departments.length > 0) {
    selectOptions = (state.departments as IDepartment[]).map(
      (department: IDepartment) => {
        return (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        );
      }
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      const volunteer: Partial<IVolunteer> = await ApiService.get<IVolunteer>(
        `${ApiEndpoints.Volunteers}/${id}`
      );

      const departments: any = await ApiService.get(ApiEndpoints.Departments);

      setState((prevState: IState) => {
        return {
          ...prevState,
          volunteer: volunteer,
          departments: departments.data
        };
      });
    };

    fetchData();
  }, [id]);

  useEffect(() => {}, [state.selectedDepartment]); // Do we need this?

  const DateComponent = (props: EditComponentProps<IRow>) => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          autoOk
          format="MM/dd/yyyy"
          clearable
          initialFocusedDate={initialDateTime()}
          value={props.value}
          onChange={date => props.onChange(date?.toISOString())}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const handleTimeChange = (date: any) => {
    if (date){
      try {
        date?.toIsoString();
      }
      catch(e) {
        //was an invalid date.  return
        return date;
      }

      //we made it here without errors; valid time AND it isnt null
      return date?.toIsoString();
    }
    else{
      //time was null; happens with blank input field using keyboard input
      return date;
    }
  };

  const TimeComponent = (props: EditComponentProps<IRow>) => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          autoOk
          clearable
          ampm={false}
          openTo="hours"
          views={['hours', 'minutes']}
          format="HH:mm"
          initialFocusedDate={initialDateTime()}
          value={props.value}
          onChange={time => {
            return props.onChange(handleTimeChange(time));
          }}
          keyboardIcon={<AccessTime style={{ fontSize: 12 }}/>}
          variant="inline"
        />
      </MuiPickersUtilsProvider>
    );
  };

  const SelectComponent = (props: EditComponentProps<IRow>) => {
    return (
      <FormControl
        variant="outlined"
        classes={{
          root: formControlStyles.root
        }}
      >
        <Select
          native
          value={props.value?.id || props.value || ''}
          onChange={(e: any) => {
            const value = parseInt(e.target.value);
            const department = (state.departments as IDepartment[]).find(
              (department: IDepartment) => {
                return department.id === value;
              }
            );

            props.onChange(value);
            multiplier = department?.multiplier || 0;
          }}
        >
          <option value="" disabled></option>
          {selectOptions.map(option => option)}
        </Select>
      </FormControl>
    );
  };

  const fetchData = async (query: Query<IRow>) => {
    const orderBy = query?.orderBy?.field ? query.orderBy.field : 'id';
    const orderDirection = query?.orderDirection
      ? query.orderDirection.toUpperCase()
      : 'ASC';
    const search = query?.search ? query.search : '';

    return await ApiService.get(ApiEndpoints.TimeEntries, {
      id: id,
      orderBy: orderBy,
      orderDirection: orderDirection,
      search: search
    })
      .then((res: any) => {
        const hoursAccumulated: any = calculateAccumulatedHours(res.data);
        const ticketsEarned: any = calculateTicketsEarned(
          hoursAccumulated.earnedHours
        );
        const aboveAndBeyondEarned: any = calculateAboveAndBeyond(
          hoursAccumulated.earnedHours
        );
        const feathersEarned: any = calculateFeathersEarned(
          hoursAccumulated.earnedHours
        );

        setState((prevState: IState) => {
          return {
            ...prevState,
            earnedHours: hoursAccumulated.earnedHours.toFixed(2),
            actualHours: hoursAccumulated.actualHours.toFixed(2),
            ticketsEarned,
            aboveAndBeyondEarned,
            feathersEarned
          };
        });

        return {
          data: res.data,
          page: res.page - 1,
          totalCount: res.total
        };
      })
      .catch(error => {
        console.log(error);
        return {
          data: [],
          page: 0,
          totalCount: 0
        };
      });
  };

  const calculateHours = (timeIn: Date, timeOut: Date) => {
    return (timeOut.getTime() - timeIn.getTime()) / 1000 / 60 / 60;
  };

  const calculateAccumulatedHours = (data: any) => {
    let earnedHours: number = 0;
    let actualHours: number = 0;

    (data as Array<any>).forEach(el => {
      const hours: number = calculateHours(
        new Date(el.timeIn),
        new Date(el.timeOut)
      );

      earnedHours += hours * el.multiplier;
      actualHours += hours;
    });

    return {
      earnedHours,
      actualHours
    };
  };

  const calculateTicketsEarned = (earnedHours: number) => {
    return Math.floor(earnedHours / 2).toFixed(0);
  };

  const calculateFeathersEarned = (earnedHours: number) => {
    let feathersEarned: number = Math.floor(earnedHours / 10);

    if (earnedHours >= 20) {
      feathersEarned -= 1;
    }

    return feathersEarned.toFixed(0);
  };

  const calculateAboveAndBeyond = (earnedHours: number) => {
    return Math.floor(earnedHours / 15).toFixed(0);
  };

  const addRecord = async (newData: IRow) => {
    if (
      new Date(newData.timeOut).getTime() < new Date(newData.timeIn).getTime()
    ) {
      showSnackbar(false, 'Time Out must be after Time In');
      return;
    }

    let success: boolean;

    return await ApiService.post(ApiEndpoints.TimeEntries, {
      date: newData.date,
      timeIn: newData.timeIn,
      timeOut: newData.timeOut,
      comments: newData.comments,
      multiplier: multiplier,
      department: newData.department,
      volunteer: state.volunteer.id
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? 'Time entry was added successfully!'
            : 'Failed to create time entry record!';

        showSnackbar(success, alertMessage);
      });
  };

  const deleteRecord = async (oldData: IRow) => {
    let success: boolean;

    await ApiService.delete(ApiEndpoints.TimeEntries, {
      id: oldData?.id
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Time entry was successfully deleted!`
            : `Failed to delete time entry!`;

        showSnackbar(success, alertMessage);
      });
  };

  const updateRecord = async (newData: IRow, oldData: IRow | undefined) => {
    if (
      new Date(newData.timeOut).getTime() < new Date(newData.timeIn).getTime()
    ) {
      showSnackbar(false, 'Time Out must be after Time In');
      return;
    }

    let success: boolean;

    return await ApiService.put(ApiEndpoints.TimeEntries, {
      id: oldData?.id,
      date: newData.date,
      timeIn: newData.timeIn,
      timeOut: newData.timeOut,
      comments: newData.comments,
      multiplier: multiplier,
      department: newData.department,
      volunteer: state.volunteer.id
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Time entry was successfully updated!`
            : `Failed to update time entry!`;
        showSnackbar(success, alertMessage);
      });
  };

  const showSnackbar = (success: boolean, alertMessage: string) => {
    ctx.snackbar.dispatch(
      SnackbarActions.setSnackbar({
        isSnackbarOpen: true,
        snackbarSeverity: success === true ? 'success' : 'error',
        snackbarMessage: alertMessage
      })
    );
  };

  const takenValueTextChanged = (name: keyof typeof state.volunteer) => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setState((prevState: IState) => {
      const updatedVolunteer = {
        ...prevState.volunteer,
        [name]: event.target.value
      };

      return {
        ...prevState,
        volunteer: updatedVolunteer
      };
    });
  };

  const checkboxHandler = (name: keyof typeof state.volunteer) => (
    event: React.ChangeEvent<{ checked: boolean }>
  ) => {
    setState((prevState: IState) => {
      const updatedVolunteer = {
        ...prevState.volunteer,
        [name]: event.target.checked
      };

      return {
        ...prevState,
        volunteer: updatedVolunteer
      };
    });
  };

  const submitVolunteerDataHandler = async () => {

    if ((state.volunteer.feathersTaken as number) > state?.feathersEarned) {
      showSnackbar(
        false,
        'Feathers Taken cannot be greater than Feathers Earned'
      );
      return;
    } else if (
      (state.volunteer.ticketsTaken as number) > state?.ticketsEarned
    ) {
      showSnackbar(
        false,
        'Tickets Taken cannot be greater than Tickets Earned'
      );
      return;
    } else if (
      (state.volunteer.aboveAndBeyondTaken as number) >
      state.aboveAndBeyondEarned
    ) {
      showSnackbar(
        false,
        'Above & Beyond Taken cannot be greater than Above & Beyond Earned'
      );
      return;
    }

    let success: boolean;

    await ApiService.put(ApiEndpoints.Volunteers, {
      id: state.volunteer.id,
      feathersTaken: state.volunteer.feathersTaken,
      ticketsTaken: state.volunteer.ticketsTaken,
      aboveAndBeyondTaken: state.volunteer.aboveAndBeyondTaken,
      twentyHours: state.volunteer.twentyHours,
      fiftyHours: state.volunteer.fiftyHours,
      oneHundredHours: state.volunteer.oneHundredHours
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Volunteer was successfully updated!`
            : `Failed to update volunteer record!`;

        showSnackbar(success, alertMessage);
        history.push('/landing/user');
      });
  };

  return (
    <PageBase>
      <div>
        <h1>Hours</h1>
      </div>
      <div>
        <h2>{state.volunteer.name}</h2>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            disabled
            label="Earned Hours"
            value={state.earnedHours}
            classes={{
              root: textFieldStyles.root
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            label="Actual Hours"
            value={state.actualHours}
            classes={{
              root: textFieldStyles.root
            }}
          />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            label="Feathers Earned"
            value={state.feathersEarned}
            classes={{
              root: textFieldStyles.root
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            disabled
            label="Tickets Earned"
            value={state.ticketsEarned}
            classes={{
              root: textFieldStyles.root
            }}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            disabled
            label="Above & Beyond Earned"
            value={state.aboveAndBeyondEarned}
            classes={{
              root: textFieldStyles.root
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Feathers Taken"
            classes={{
              root: textFieldStyles.root
            }}
            value={state.volunteer.feathersTaken || ''}
            onChange={takenValueTextChanged('feathersTaken')}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="Tickets Taken"
            classes={{
              root: textFieldStyles.root
            }}
            value={state.volunteer.ticketsTaken || ''}
            onChange={takenValueTextChanged('ticketsTaken')}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Above & Beyond Taken"
            classes={{
              root: textFieldStyles.root
            }}
            value={state.volunteer.aboveAndBeyondTaken || ''}
            onChange={takenValueTextChanged('aboveAndBeyondTaken')}
          />
        </Grid>

        <Grid item xs={4}></Grid>
        <Grid item xs={6}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={state.earnedHours < 20 ? true : false}
                  checked={state.volunteer.twentyHours ? true : false}
                  value="twentyHours"
                  onChange={checkboxHandler('twentyHours')}
                />
              }
              label="20 Hours"
              labelPlacement="start"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={state.actualHours < 50 ? true : false}
                  checked={state.volunteer.fiftyHours ? true : false}
                  value="fiftyHours"
                  onChange={checkboxHandler('fiftyHours')}
                />
              }
              label="50 Hours"
              labelPlacement="start"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={state.actualHours < 100 ? true : false}
                  checked={state.volunteer.oneHundredHours ? true : false}
                  value="oneHundredHours"
                  onChange={checkboxHandler('oneHundredHours')}
                />
              }
              label="100 Hours"
              labelPlacement="start"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={2}>
          <Button color="primary" onClick={submitVolunteerDataHandler}>
            SAVE
          </Button>
        </Grid>
      </Grid>
      <Divider />

      <MaterialTable
        title=""
        columns={tableColumns}
        tableRef={tableRef}
        data={query => fetchData(query)}
        options={{
          actionsColumnIndex: -1,
          addRowPosition: 'first',
          sorting: true,
          grouping: true,
          search: false,
          debounceInterval: 1000,
          paging: false
        }}
        actions={[
          {
            icon: () => <Refresh />,
            tooltip: 'Refresh Data',
            isFreeAction: true,
            onClick: () => tableRef.current && tableRef.current.onQueryChange()
          }
        ]}
        icons={{
          Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
          Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
          Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
          Delete: forwardRef((props, ref) => (
            <DeleteOutline {...props} ref={ref} />
          )),
          DetailPanel: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref} />
          )),
          Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
          Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
          Filter: forwardRef((props, ref) => (
            <FilterList {...props} ref={ref} />
          )),
          ResetSearch: forwardRef((props, ref) => (
            <Clear {...props} ref={ref} />
          )),
          Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
          SortArrow: forwardRef((props, ref) => (
            <ArrowDownward {...props} ref={ref} />
          )),
          ThirdStateCheck: forwardRef((props, ref) => (
            <Remove {...props} ref={ref} />
          )),
          ViewColumn: forwardRef((props, ref) => (
            <ViewColumn {...props} ref={ref} />
          ))
        }}
        editable={{
          onRowAdd: newData => addRecord(newData),
          onRowUpdate: (newData, oldData) => updateRecord(newData, oldData),
          onRowDelete: oldData => deleteRecord(oldData)
        }}
      />
    </PageBase>
  );
};

export default VolunteerHours;
