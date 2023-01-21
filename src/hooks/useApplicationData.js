import React from "react";
import { useState} from "react";
import axios from "axios";

export default function useAppplication() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const updateSpots = (appointments) => {
    
    const dayObj = state.days.find(item => item.name === state.day);
    
    const spots = dayObj.appointments.filter(
      (appointmentId) => {
        const apptObj = appointments[appointmentId]
        
        return apptObj.interview === null;
      }
    ).length;
   
    const day = {...dayObj, spots}

    return state.days.map(element => element.name === state.day? day : element)
  };


  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`)
      .then(response => {
        const days = updateSpots(appointments);
        setState((prev) => ({ ...prev, appointments, days }));
      })
  };

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(appointments);
    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then(() => {
        
        setState({ ...state, appointments, days });
      });
  }


  return { state, setState, bookInterview, cancelInterview }
}