import axios from 'axios'
import {setAlert} from './alert'


import {
    GET_GROUP,GROUP_ERROR,DELETE_GROUP,GET_GROUP_DETAILS, USER_LOADED, PROFILE_ERROR, GET_USERS
} from './types'

export const getallgroups = () => async dispatch =>{
    try {
        const res = await axios.get('/api/group/all');
        console.log("response object",res)
        console.log("response data",res.data)
        dispatch({
            type: GET_GROUP,
            payload: res.data
        });
        
    } catch (error) {
        console.log("err response",error)
        dispatch({
            type: GROUP_ERROR,
            payload: {msg:error.response.statusText, status: error.response.status }
        });
    }
}

export const getgroup = id => async dispatch =>{
    try {
        console.log(id)
        const res = await axios.get(`/api/group/details/${id}`);
        console.log(id)
        console.log("response object",res)
        console.log("response data",res.data)
        dispatch({
            type: GET_GROUP_DETAILS,
            payload: res.data
        });
        
    } catch (error) {
        console.log("err response",error)
        dispatch({
            type: GROUP_ERROR,
            payload: {msg:error.response.statusText, status: error.response.status }
        });
    }
}

export const addGroup = (FormData,history,edit= false) => async dispatch => {
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/group/',FormData,config);
        dispatch({
          type: GET_GROUP_DETAILS,
          payload: res.data
      });
      dispatch(setAlert(edit ? 'Group Updated': 'Group created', 'success'));
  if(!edit) {
      if(res.data.settings.requiredSkills){history.push(`/add-members/${res.data._id}/${res.data.settings.numberOfStudents}/${res.data.settings.requiredSkills}`);}
      else{history.push(`/add-members/${res.data._id}/${res.data.settings.numberOfStudents}`);}

  }
        
    } catch (error) {
      const errors = error.response.data.errors;
      if(errors) {
          errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
      }
      dispatch({
          type: GROUP_ERROR,
          payload: {msg:error.response.statusText, status: error.response.status }
      });
    }
  
  
  }

  export const editGroup = (FormData,history,edit= false,id) => async dispatch => {
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put(`/api/group/${id}`,FormData,config);
        dispatch({
          type: GET_GROUP,
          payload: res.data
      });
      dispatch(setAlert(edit ? 'Project Updated': 'Project created', 'success'));
  if(!edit) {
      history.push('/dashboard');
  }
        
    } catch (error) {
      const errors = error.response.data.errors;
      if(errors) {
          errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
      }
      dispatch({
          type: GROUP_ERROR,
          payload: {msg:error.response.statusText, status: error.response.status }
      });
    }
  
  
  }

  export const deletegroup = id => async dispatch =>{
    try {
        console.log(id)
        const res = await axios.delete(`/api/group/${id}`);
        console.log(id)
        console.log("response object",res)
        console.log("response data",res.data)
        dispatch({
            type: DELETE_GROUP,
            payload: res.data
        });
        dispatch(setAlert('Project Removed', 'success'));
        
    } catch (error) {
        console.log("err response",error)
        dispatch({
            type: GROUP_ERROR,
            payload: {msg:error.response.statusText, status: error.response.status }
        });
    }
}
export const invitMember = (FormData,history,edit= false,id) => async dispatch => {
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put(`/api/group/assign/${id}`,FormData,config);
        dispatch({
          type: GET_GROUP,
          payload: res.data
      });
      dispatch(setAlert(edit ? 'Group Updated': 'Group created', 'success'));
  if(!edit) {
      history.push('/dashboard');
  }
        
    } catch (error) {
      const errors = error.response.data.errors;
      if(errors) {
          errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
      }
      dispatch({
          type: GROUP_ERROR,
          payload: {msg:error.response.statusText, status: error.response.status }
      });
    }
  
  
  }

export const AcceptInvitation=(id)=>async dispatch =>  {
    try {
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
       const data ={etat:true}
       
        const res = await axios.put(`/api/group/accpterInv/${id}`,data,config);
        console.log('inv accep');
        dispatch({
            type: GET_USERS,
            payload: res.data
        });
        dispatch(setAlert('Invitation Accepted', 'success'));
    } catch (error) {

         dispatch({
          type: GET_USERS,
          payload: {msg:error.response.statusText, status: error.response.status }
      });
    }
}

export const DelteInvitation=(id)=>async dispatch =>  {
    try {
        const data ={etat:false}
        const config = {
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put(`/api/group/accpterInv/${id}`,data,config);
        console.log('inv delet');
        dispatch({
            type: GET_USERS,
            payload: res.data
        });
        dispatch(setAlert('Invitation Deleted', 'danger'));
    } catch (error) {

         dispatch({
          type: GET_USERS,
          payload: {msg:error.response.statusText, status: error.response.status }
      });
    }
}




