import React, { forwardRef, useEffect, useState } from 'react';
import MaterialTable, {
  Query,
  EditComponentProps,
  MTableCell,
  MTableBodyRow,
  MTableBody
} from 'material-table';
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
  ViewColumn,
  Refresh
} from '@material-ui/icons';
import { Select, FormControl, makeStyles } from '@material-ui/core';

import { ApiService } from '../../../../../shared/Services';
import { useStore } from '../../../../../store';
import { SnackbarActions } from '../../../../../store/Actions';

interface Row {
  id: number;
  name: string;
  headVolunteer: number;
  deputyVolunteer: number;
}

interface IVolunteer {
  id: number;
  mka: string;
}

interface TableState {
  volunteers: IVolunteer[];
}

const useFormControlStyles = makeStyles({
  root: {
    width: '100%'
  }
});

const Departments: React.FC = props => {
  const [state, setState] = useState<TableState>({
    volunteers: []
  });
  const formControlStyles = useFormControlStyles();
  let selectOptions: object[] = [];
  const globalState = useStore();
  const ctx = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };
  const tableRef = React.createRef<any>();

  const tableColumns = [
    { title: 'Department Name', field: 'name' },
    {
      title: 'Head',
      field: 'headVolunteer',
      editComponent: (props: EditComponentProps<Row>) => (
        <HeadVolunteerComponent {...props} />
      ),
      render: (rowData: Row) => {
        const headVolunteer: IVolunteer | undefined = state.volunteers.find(
          (volunteer: IVolunteer) => rowData.headVolunteer === volunteer.id
        );
        return <div>{headVolunteer?.mka}</div>;
      }
    },
    {
      title: 'Deputy',
      field: 'deputyVolunteer',
      editComponent: (props: EditComponentProps<Row>) => (
        <DeputyVolunteerComponent {...props} />
      ),
      render: (rowData: Row) => {
        const deputyVolunteer: IVolunteer | undefined = state.volunteers.find(
          (volunteer: IVolunteer) => rowData.deputyVolunteer === volunteer.id
        );
        return <div>{deputyVolunteer?.mka}</div>;
      }
    }
  ];

  if (state.volunteers.length > 0) {
    selectOptions = (state.volunteers as IVolunteer[]).map(
      (volunteer: IVolunteer) => {
        return (
          <option key={volunteer.id} value={volunteer.id}>
            {volunteer.mka}
          </option>
        );
      }
    );
  }

  useEffect(() => {
    const fetchVolunteers = async () => {
      const response: any = await ApiService.get(
        'http://localhost:5000/volunteers'
      );

      setState((prevState: TableState) => {
        return {
          ...prevState,
          volunteers: response
        };
      });
    };

    fetchVolunteers();
  }, []);

  const fetchData = async (query: Query<Row>) => {
    const orderBy = query?.orderBy?.field ? query.orderBy.field : 'id';
    const orderDirection = query?.orderDirection
      ? query.orderDirection.toUpperCase()
      : 'ASC';
    const search = query?.search ? query.search : '';
    const url = 'http://localhost:5000/departments';

    return await ApiService.get(url, {
      per_page: query.pageSize,
      page: query.page + 1,
      orderBy: orderBy,
      orderDirection: orderDirection,
      search: search
    }).then((res: any) => {
      return {
        data: res.data,
        page: res.page - 1,
        totalCount: res.total
      };
    });
  };

  const addRecord = async (newData: Row) => {
    if (newData.name === undefined) {
      return;
    }

    let success: boolean;

    return await ApiService.post('http://localhost:5000/departments', {
      name: newData.name,
      headVolunteerId: newData.headVolunteer,
      deputyVolunteerId: newData.deputyVolunteer
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Department ${newData.name} was successfully created!`
            : `Failed to create Department ${newData.name}. The Department already exists.`;

        showSnackbar(success, alertMessage);
      });
  };

  const updateRecord = async (newData: Row, oldData: Row | undefined) => {
    let success: boolean;

    return await ApiService.put(`http://localhost:5000/departments`, {
      id: oldData?.id,
      name: newData.name,
      headVolunteerId: newData.headVolunteer,
      deputyVolunteerId: newData.deputyVolunteer
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Department ${oldData?.name} was successfully updated to ${newData.name}!`
            : `Failed to update Department ${oldData?.name} to ${newData.name}. The Department already exists.`;
        showSnackbar(success, alertMessage);
      });
  };

  const deleteRecord = async (oldData: Row) => {
    let success: boolean;

    return await ApiService.delete(`http://localhost:5000/departments`, {
      id: oldData?.id
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Department ${oldData?.name} was successfully deleted!`
            : `Failed to delete Department ${oldData?.name}!`;

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

  const HeadVolunteerComponent = (props: EditComponentProps<Row>) => {
    return <SelectComponent {...props} changeKey={'selectedHeadVolunteer'} />;
  };

  const DeputyVolunteerComponent = (props: EditComponentProps<Row>) => {
    return <SelectComponent {...props} changeKey={'selectedDeputyVolunteer'} />;
  };

  const SelectComponent = (props: any) => {
    return (
      <FormControl
        variant="outlined"
        classes={{
          root: formControlStyles.root
        }}
      >
        <Select
          native
          title="Filter By"
          value={props.value?.id || props.value || ''}
          onChange={e => props.onChange(e.target.value)}
        >
          <option value="" disabled></option>
          {selectOptions.map(option => option)}
        </Select>
      </FormControl>
    );
  };

  return (
    <MaterialTable
      title="Departments"
      columns={tableColumns}
      options={{
        actionsColumnIndex: -1,
        search: true,
        debounceInterval: 1000
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
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => (
          <FirstPage {...props} ref={ref} />
        )),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => (
          <ChevronRight {...props} ref={ref} />
        )),
        PreviousPage: forwardRef((props, ref) => (
          <ChevronLeft {...props} ref={ref} />
        )),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
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
      tableRef={tableRef}
      data={query => fetchData(query)}
      actions={[
        {
          icon: () => <Refresh />,
          tooltip: 'Refresh Data',
          isFreeAction: true,
          onClick: () => tableRef.current && tableRef.current.onQueryChange()
        }
      ]}
      editable={{
        onRowAdd: newData => addRecord(newData),
        onRowUpdate: (newData, oldData) => updateRecord(newData, oldData),
        onRowDelete: oldData => deleteRecord(oldData)
      }}
      components={{
        Cell: props => {
          return <MTableCell {...props} />;
        },
        Row: props => {
          return <MTableBodyRow {...props} />;
        },
        Body: props => {
          return <MTableBody {...props} />;
        }
      }}
    />
  );
};

export default Departments;
