import React, { forwardRef, useState, useEffect, createRef } from 'react';
import { FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable, { Column, Query, MTableToolbar } from 'material-table';
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

import { Select } from '../../../../../shared/Input';
import { ApiService } from '../../../../../shared/Services';
import {ApiEndpoints} from '../../../../../shared/Constants/Api/ApiEndpoints';
import { useStore } from '../../../../../store';
import { SnackbarActions } from '../../../../../store/Actions';
import classes from './LocalGroups.module.scss';

interface Row {
  id: number;
  name: string;
}

interface TableState {
  columns: Array<Column<Row>>;
  data: Row[];
  kingdoms: Row[];
  selectedKingdom: Row | {};
}

const useFormControlStyles = makeStyles({
  root: {
    width: '100%'
  }
});

const LocalGroups: React.FC = props => {
  const [state, setState] = useState<TableState>({
    columns: [{ title: 'Local Group Name', field: 'name' }],
    data: [],
    kingdoms: [],
    selectedKingdom: {}
  });
  const globalState = useStore();

  const formControlStyles = useFormControlStyles();

  const ctx = {
    snackbar: {
      state: globalState.state,
      dispatch: globalState.dispatch
    }
  };

  const tableRef = createRef<any>();

  let selectOptions: object[] = [];

  useEffect(() => {
    const fetchKingdoms = async () => {
      const response: any = await ApiService.get(
        ApiEndpoints.Kingdoms
      );

      setState((prevState: TableState) => {
        return {
          ...prevState,
          kingdoms: response.data
        };
      });
    };

    fetchKingdoms();
  }, []);

  useEffect(() => {
    tableRef.current.onQueryChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedKingdom]);

  if (state.kingdoms.length > 0) {
    selectOptions = (state.kingdoms as Row[]).map((kingdom: Row) => {
      return (
        <option key={kingdom.id} value={kingdom.id}>
          {kingdom.name}
        </option>
      );
    });
  }

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    // If anything other than a number, returns 'NaN'
    const id: number = Number(event.target.value);

    if (!isNaN(id)) {
      const selectedKingdom: Row | undefined = state.kingdoms.find(
        (kingdom: Row) => {
          return kingdom.id === id;
        }
      );

      // Don't set state if we couldn't find the user.
      if (selectedKingdom !== undefined) {
        setState((prevState: TableState) => {
          return {
            ...prevState,
            [name]: selectedKingdom
          };
        });
      }
    }
  };

  const fetchData = async (query: Query<Row>) => {
    const kingdomId = (state.selectedKingdom as Row).id || null;
    const orderBy = query?.orderBy?.field ? query.orderBy.field : 'id';
    const orderDirection = query?.orderDirection
      ? query.orderDirection.toUpperCase()
      : 'ASC';
    const search = query?.search ? query.search : '';

    return await ApiService.get(ApiEndpoints.LocalGroups, {
      per_page: query.pageSize,
      page: query.page + 1,
      orderBy: orderBy,
      orderDirection: orderDirection,
      kingdomId: kingdomId,
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
    let alertMessage: string = '';
    let success: boolean = false;

    if (newData.name === undefined) {
      alertMessage = 'Please enter a name for the Local Group';
    } else if (!(state.selectedKingdom as Row).id) {
      alertMessage = 'Please select a Kingdom before continuing.';
    } else {
      return await ApiService.post(ApiEndpoints.LocalGroups, {
        name: newData.name,
        kingdomId: (state.selectedKingdom as Row).id
      })
        .then(() => (success = true))
        .catch(() => (success = false))
        .finally(() => {
          const alertMessage =
            success === true
              ? `Local Group ${newData.name} was successfully created!`
              : `Failed to create Local Group ${newData.name}. The Local Group already exists.`;

          showSnackbar(success, alertMessage);
        });
    }

    showSnackbar(success, alertMessage);
  };

  const updateRecord = async (newData: Row, oldData: Row | undefined) => {
    if (newData.name === oldData?.name && newData.id === oldData?.id) {
      return;
    }

    let success: boolean;

    return await ApiService.put(ApiEndpoints.LocalGroups, {
      id: oldData?.id,
      name: newData.name
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Local Group ${oldData?.name} was successfully updated to ${newData.name}!`
            : `Failed to update Local Group ${oldData?.name} to ${newData.name}. The Local Group already exists.`;
        showSnackbar(success, alertMessage);
      });
  };

  const deleteRecord = async (oldData: Row) => {
    let success: boolean;

    return await ApiService.delete(ApiEndpoints.LocalGroups, {
      id: oldData?.id
    })
      .then(() => (success = true))
      .catch(() => (success = false))
      .finally(() => {
        const alertMessage =
          success === true
            ? `Local Group ${oldData?.name} was successfully deleted!`
            : `Failed to delete Local Group ${oldData?.name}!`;

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
    <>
      <div className={classes.filterBy}>
        <FormControl
          variant="outlined"
          classes={{
            root: formControlStyles.root
          }}
        >
          <Select
            native
            title="Filter By"
            value={
              Object.keys(state.selectedKingdom).length > 0
                ? (state.selectedKingdom as Row).id
                : ''
            }
            onChange={handleChange('selectedKingdom')}
          >
            <option value="" disabled></option>
            {selectOptions.map(option => option)}
          </Select>
        </FormControl>
      </div>

      <MaterialTable
        title="Local Groups"
        columns={state.columns}
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
          Toolbar: props => {
            for (let i = 0; i < props.actions.length; i++) {
              if (
                props.actions[i].tooltip === 'Add' &&
                props.actions[i].position === 'toolbar'
              ) {
                props.actions[i].disabled = !(
                  Object.keys(state.selectedKingdom).length > 0
                )
                  ? true
                  : false;
                break;
              }
            }

            return <MTableToolbar {...props} />;
          }
        }}
      />
    </>
  );
};

export default LocalGroups;
