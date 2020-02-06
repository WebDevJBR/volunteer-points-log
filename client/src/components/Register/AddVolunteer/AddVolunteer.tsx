import React from 'react';

import VolunteerEdit from '../../../hoc/VolunteerEdit/VolunteerEdit'

const AddVolunteer: React.FC = (props) => {
  return (
    <VolunteerEdit />
  )
}

export default AddVolunteer;


// import React, { useState } from 'react';
// import {
//   Container,
//   Paper,
//   FormControl,
//   FormControlLabel,
//   Radio,
//   RadioGroup
// } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

// import TextField from '../../../shared/Input/TextField/TextField';
// import Button from '../../../shared/Input/Button/Button';
// import Select from '../../../shared/Input/Select/Select';
// import classes from './AddVolunteer.module.scss';

// interface IKingdom {
//   id: number;
//   name: string;
// }

// interface ILocalGroup {
//   id: number;
//   name: string;
// }

// interface IState {
//   name: string;
//   mka: string;
//   membershipNumber?: number;
//   kingdomList: IKingdom[] | [];
//   selectedKingdom: IKingdom | {};
//   localGroupList: ILocalGroup[] | [];
//   selectedLocalGroup?: ILocalGroup | {};
//   toReceiveFundsOther?: string;
//   toReceiveFundsSelect?: number;
// }

// const useFormControlStyles = makeStyles({
//   root: {
//     width: '100%'
//   }
// });

// const useRadioStyles = makeStyles({
//   root: {
//     padding: '5px 9px 9px'
//   }
// });

// const useSelectStyles = makeStyles({
//   root: {
//     backgroundColor: '#FFFFFF'
//   },
//   select: {
//     paddingLeft: '10px'
//   },
//   outlined: {
//     padding: '6px 8px 7px'
//   }
// });

// const useTextFieldStyles = makeStyles({
//   root: {
//     width: '100%'
//   }
// });

// const AddVolunteer: React.FC = () => {
//   const [state, setState] = useState<IState>({
//     name: '',
//     mka: '',
//     membershipNumber: undefined,
//     kingdomList: [],
//     selectedKingdom: {},
//     localGroupList: [],
//     selectedLocalGroup: {},
//     toReceiveFundsOther: '',
//     toReceiveFundsSelect: undefined
//   });

//   const selectStyles = useSelectStyles();
//   const formControlStyles = useFormControlStyles();
//   const radioStyles = useRadioStyles();
//   const textFieldStyles = useTextFieldStyles();

//   const handleChange = (name: keyof typeof state) => (
//     event: React.ChangeEvent<{ value: unknown }>
//   ) => {
//     setState({
//       ...state,
//       [name]: event.target.value
//     });
//   };

//   return (
//     <Container maxWidth='md'>
//       <Paper elevation={3} className={classes.paper}>
//         <div className={classes.volunteerNames}>
//           <div className={classes.item}>
//             <TextField
//               value={state.name}
//               onChange={handleChange('name')}
//               className={classes.textField}
//               variant='outlined'
//               title='Name'
//               required
//             ></TextField>
//           </div>
//           <div className={classes.item}>
//             <TextField
//               value={state.mka}
//               onChange={handleChange('mka')}
//               className={classes.textField}
//               variant='outlined'
//               title='MKA'
//               required
//             ></TextField>
//           </div>
//         </div>

//         <div className={classes.membership}>
//           <div className={classes.item}>
//             <TextField
//               value={state.membershipNumber}
//               onChange={handleChange('membershipNumber')}
//               className={classes.textField}
//               variant='outlined'
//               title='Membership #'
//             ></TextField>
//           </div>
//           <div className={classes.item}>
//             <FormControl
//               variant='outlined'
//               classes={{
//                 root: formControlStyles.root
//               }}
//             >
//               <Select native required title='Kingdom'></Select>
//             </FormControl>
//           </div>
//           <div className={classes.item}>
//             <FormControl
//               variant='outlined'
//               classes={{
//                 root: formControlStyles.root
//               }}
//             >
//               <Select native title='Local Group'></Select>
//             </FormControl>
//           </div>
//         </div>

//         <div className={classes.receiveFunds}>
//           <TextField
//             title='To Receive Funds'
//             className={`${classes.receiveFundsText} ${classes.textField}`}
//             variant='outlined'
//           ></TextField>
//           <RadioGroup className={classes.receiveFundsRadioGroup} row>
//             <FormControlLabel
//               value='kingdom'
//               label='Kingdom'
//               labelPlacement='end'
//               control={
//                 <Radio
//                   classes={{
//                     root: radioStyles.root
//                   }}
//                   color='default'
//                 />
//               }
//             />
//             <FormControlLabel
//               value='localGroup'
//               label='Local Group'
//               labelPlacement='end'
//               control={
//                 <Radio
//                   classes={{
//                     root: radioStyles.root
//                   }}
//                   color='default'
//                 />
//               }
//             />
//             <FormControlLabel
//               value='other'
//               label='Other'
//               labelPlacement='end'
//               control={
//                 <Radio
//                   classes={{
//                     root: radioStyles.root
//                   }}
//                   color='default'
//                 />
//               }
//             />
//           </RadioGroup>
//         </div>

//         <Button color='primary'>Save</Button>
//       </Paper>
//     </Container>
//   );
// };

// export default AddVolunteer;
