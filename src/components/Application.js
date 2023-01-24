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
import useApplicationData from "../hooks/useApplicationData"

export default function Application(props) {
  const { state, setState, bookInterview, cancelInterview } = useApplicationData()

  const setDay = day => setState({ ...state, day });
  // const dailyAppointments = getAppointmentsForDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);
  const interviewersForDay = getInterviewersForDay(state, state.day);
  
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
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
        <Appointment key="last" time="5pm" /> 
      </section>
    </main>
  );
}
