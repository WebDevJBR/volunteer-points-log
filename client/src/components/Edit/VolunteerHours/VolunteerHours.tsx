import React, { useEffect, forwardRef } from 'react';

import MaterialTable, { Column, EditComponentProps } from 'material-table';
import { Grid, Paper, Divider } from '@material-ui/core';
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useParams } from 'react-router-dom';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn
} from '@material-ui/icons';

import PageBase from '../../../hoc/PageBase/PageBase';
import { Select } from '../../../shared/Input';
import classes from './VolunteerHours.module.scss';

interface IRow {
  date: string;
  department: string;
  timeIn: string;
  timeOut: string;
  multiplier: number;
  comments: string;
}

interface IState {
  table: {
    columns: Array<Column<IRow>>;
    data: IRow[];
  };
  id: string | undefined;
  initialDateTime: string | undefined;
}

const VolunteerHours: React.FC = props => {
  const intialDateTime = () => {
    return new Date().toISOString();
  };
  const [state, setState] = React.useState<IState>({
    table: {
      columns: [
        {
          title: 'Date',
          field: 'date',
          defaultGroupSort: 'desc',
          defaultSort: 'desc',
          render: renderData => {
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
          defaultGroupSort: 'asc',
          defaultSort: 'asc',
          editComponent: (props: EditComponentProps<IRow>) => (
            <SelectComponent {...props} />
          )
        },
        {
          title: 'Time In',
          field: 'timeIn',
          render: renderData => {
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
          render: renderData => {
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
        { title: 'Multiplier', field: 'multiplier' },
        { title: 'Comments', field: 'comments' }
      ],
      data: []
    },
    id: undefined,
    initialDateTime: intialDateTime()
  });

  const { id } = useParams();

  useEffect(() => {
    setState((prevState: IState) => {
      return {
        ...prevState,
        id: id
      };
    });
  }, [id]);

  useEffect(() => {
    console.log(state);
  }, [state]);

  const DateComponent = (props: EditComponentProps<IRow>) => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          autoOk
          format="MM/dd/yyyy"
          clearable
          initialFocusedDate={intialDateTime()}
          value={props.value}
          onChange={date => props.onChange(date?.toISOString())}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const TimeComponent = (props: EditComponentProps<IRow>) => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <TimePicker
          autoOk
          clearable
          ampm={false}
          openTo="hours"
          views={['hours', 'minutes']}
          format="HH:mm"
          initialFocusedDate={intialDateTime()}
          value={props.value}
          onChange={time => {
            return props.onChange(time?.toISOString());
          }}
        />
      </MuiPickersUtilsProvider>
    );
  };

  const SelectComponent = (props: EditComponentProps<IRow>) => {
    return (
      <Select
        native
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
      />
    );
  };

  return (
    <PageBase>
      <div>
        <h1>Hours</h1>
      </div>
      <div>Odhran macc Corbain</div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper className={classes.paper}>Earned Hours:</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>Tickets Earned:</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>Above & Beyond Earned:</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>Actual Hours:</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>Tickets Taken:</Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>Above & Beyond Taken:</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>Feathers Taken:</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            20 Hours: 50 Hours: 100 Hours:
          </Paper>
        </Grid>
      </Grid>
      <Divider />

      <MaterialTable
        title=""
        columns={state.table.columns}
        data={state.table.data}
        options={{
          actionsColumnIndex: -1,
          addRowPosition: 'first',
          sorting: true,
          grouping: true
        }}
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
          FirstPage: forwardRef((props, ref) => (
            <FirstPage {...props} ref={ref} />
          )),
          LastPage: forwardRef((props, ref) => (
            <LastPage {...props} ref={ref} />
          )),
          NextPage: forwardRef((props, ref) => (
            <ChevronRight {...props} ref={ref} />
          )),
          PreviousPage: forwardRef((props, ref) => (
            <ChevronLeft {...props} ref={ref} />
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
          onRowAdd: newData =>
            new Promise(resolve => {
              console.log('onRowAdd: ', newData);
              setTimeout(() => {
                resolve();
                setState(prevState => {
                  const data = [...prevState.table.data];
                  data.push(newData);
                  return {
                    ...prevState,
                    table: { ...prevState.table, data }
                  };
                });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              console.log('onRowUpdate newData: ', newData);
              console.log('onRowUpdate oldData: ', oldData);
              setTimeout(() => {
                resolve();
                if (oldData) {
                  setState(prevState => {
                    const data = [...prevState.table.data];
                    data[data.indexOf(oldData)] = newData;
                    return {
                      ...prevState,
                      table: { ...prevState.table, data }
                    };
                  });
                }
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              console.log('onRowDelete: ', oldData);
              setTimeout(() => {
                resolve();
                setState(prevState => {
                  const data = [...prevState.table.data];
                  data.splice(data.indexOf(oldData), 1);
                  return {
                    ...prevState,
                    table: { ...prevState.table, data }
                  };
                });
              }, 600);
            })
        }}
      />
    </PageBase>
  );
};

export default VolunteerHours;
