import React, { forwardRef } from 'react';
import MaterialTable, { Column, Query } from 'material-table';
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

import { ApiService } from '../../../../../shared/Services';
import {ApiEndpoints} from '../../../../../shared/Constants/Api/ApiEndpoints';
import { useStore } from '../../../../../store';
import { SnackbarActions } from '../../../../../store/Actions';

interface Row {
  id: number;
  name: string;
}

interface TableState {
  columns: Array<Column<Row>>;
}

const Kingdoms: React.FC = props => {
  const state = React.useState<TableState>({
    columns: [{ title: 'Kingdom Name', field: 'name' }]
  })[0];

  const globalState = useStore();

  const ctx = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };

  const tableRef = React.createRef<any>();

  const fetchData = async (query: Query<Row>) => {
    const orderBy = query?.orderBy?.field ? query.orderBy.field : 'id';
    const orderDirection = query?.orderDirection
      ? query.orderDirection.toUpperCase()
      : 'ASC';
    const search = query?.search ? query.search : '';

    return await ApiService.get(ApiEndpoints.Kingdoms, {
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

    return await ApiService.post(ApiEndpoints.Kingdoms, {
      name: newData.name
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Kingdom ${newData.name} was successfully created!`
            : `Failed to create Kingdom ${newData.name}. The Kingdom already exists.`;

        showSnackbar(success, alertMessage);
      });
  };

  const updateRecord = async (newData: Row, oldData: Row | undefined) => {
    if (newData.name === oldData?.name && newData.id === oldData?.id) {
      return;
    }

    let success: boolean;

    return await ApiService.put(ApiEndpoints.Kingdoms, {
      id: oldData?.id,
      name: newData.name
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Kingdom ${oldData?.name} was successfully updated to ${newData.name}!`
            : `Failed to update Kingdom ${oldData?.name} to ${newData.name}. The Kingdom already exists.`;
        showSnackbar(success, alertMessage);
      });
  };

  const deleteRecord = async (oldData: Row) => {
    let success: boolean;

    return await ApiService.delete(ApiEndpoints.Kingdoms, {
      id: oldData?.id
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Kingdom ${oldData?.name} was successfully deleted!`
            : `Failed to delete Kingdom ${oldData?.name}!`;

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

  return (
    <MaterialTable
      title="Kingdoms"
      columns={state.columns}
      options={{
        actionsColumnIndex: -1,
        addRowPosition: 'first',
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
    />
  );
};

export default Kingdoms;
