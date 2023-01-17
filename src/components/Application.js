import React from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment/index";
import { useState, useEffect } from "react";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  
  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prev => ({ ...prev, days }));
  
  const appointmentList = Object.values(state.appointments).map((appointment) => {
    return (
      <Appointment 
       key={appointment.id}
       {...appointment}
      />
    )
   });

  useEffect(() => {
     axios.get('http://localhost:8001/api/days')
     .then((response) => {
      setDays(response.data);
     })
  }, [])

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
        {appointmentList}
      </section>
    </main>
  );
}
