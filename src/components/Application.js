import React from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment/index";
import { useState, useEffect } from "react";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  // const dailyAppointments = getAppointmentsForDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);
  const interviewersForDay = getInterviewersForDay(state, state.day);
  
   const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview:null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
   
    return axios.delete(`/api/appointments/${id}`)
      .then(response => {
        setState((prev) => ({...prev, appointments}));
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

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState({...state, appointments})
      }); 
  }

  useEffect(() => {
     Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
     ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }))
     })
  }, [])

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
     
      return (
        <Appointment 
         key={appointment.id}
         id={appointment.id}
         time={appointment.time}
         interview={interview}
         interviewers={interviewersForDay}
         bookInterview={bookInterview}
         cancelInterview={cancelInterview}
        />
      );
     });

  return (
    <main className="layout">
      <section className="sidebar">
        <img className="sidebar--centered" src="images/logo.png" alt="Interview Scheduler"/>
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList
         days={state.days}
         value={state.day}
        onChange={setDay}
        />
        </nav>
        <img className="sidebar__lhl sidebar--centered" src="images/lhl.png" alt="Lighthouse Labs"/>
      </section>
      <section className="schedule">
        {schedule}
      </section>
    </main>
  );
}
