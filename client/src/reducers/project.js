import { GET_PROJECT, PROJECT_ERROR } from "../actions/types";

const initialState = {
    projects:[],
    project: null,
    repos:[],
    loading:true,
    error:{}
}

export default function(state=initialState,action){
    const  {type, payload} = action;
    switch(type) {
      case  GET_PROJECT:
          return{
              ...state,
              projects:payload,
              loading:false
          }
      case PROJECT_ERROR:
          return {
              ...state,
              error:payload,
              loading:false
          }
    
        default:
            return state;
    }
}