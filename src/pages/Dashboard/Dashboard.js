import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import {
  Button,
  Alert,
  Container,
  ButtonGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import moment from "moment";
import socketio from "socket.io-client";
import "./Dashboard.css";
//www.youtube.com/watch?v=prOC9Px4wtg&list=PLqrQf0z-Hg7jD3ASYy9febJhQoUbzC8kb&index=11
//dashboard will show all the events
export default function Dashboard({ history }) {
  const [events, setEvents] = useState([]);
  const user = localStorage.getItem("user");
  const user_id = localStorage.getItem("user_id");
  const [rSelected, setRSelected] = useState(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [messageHandler, setMessageHandler] = useState("");
  const [eventsRequests, setEventsRequest] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [eventRequestMessage, setEventRequestMessage] = useState("");
  const [eventRequestSuccess, setEventRequestSuccess] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    getEvents();
  }, []);

  const socket = useMemo(
    () => socketio("http://localhost:5000", { query: { user: user_id } }),
    [user_id]
  );

  useEffect(() => {
    socket.on("registration_request", (data) =>
      setEventsRequest([...eventsRequests, data])
    );
  }, [eventsRequests, socket]);

  const filterHandler = (query) => {
    setRSelected(query);
    getEvents(query);
  };

  const myEventHandler = async () => {
    try {
      setRSelected("myevents");
      const response = await api.get("/user/events", {
        headers: { user: user },
      });
      setEvents(response.data.events);
    } catch (error) {
      history.push("/login");
    }
  };

  const getEvents = async (filter) => {
    try {
      const url = filter ? `/dashboard/${filter}` : "/dashboard";
      const response = await api.get(url, { headers: { user: user } });
      setEvents(response.data.events);
    } catch (error) {
      history.push("/login");
    }
  };

  const deleteEventHandler = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`, { headers: { user: user } });
      setSuccess(true);
      setMessageHandler("The event was deleted successfully!");
      setTimeout(() => {
        setSuccess(false);
        filterHandler(null);
        setMessageHandler("");
      }, 2500);
    } catch (error) {
      setError(true);
      setMessageHandler("Error when deleting event");
      setTimeout(() => {
        setError(false);
        setMessageHandler("");
      }, 2000);
    }
  };

  const registrationRequestHandler = async (event) => {
    try {
      await api.post(`/registration/${event._id}`, {}, { headers: { user } });
      setSuccess(true);
      setMessageHandler(
        `The request for the event ${event.title} was successfully!`
      );
      setTimeout(() => {
        setSuccess(false);
        filterHandler(null);
        setMessageHandler("");
      }, 2500);
    } catch (error) {
      setError(true);
      setMessageHandler(
        `The request for the event ${event.title} wasn't successfully!`
      );
      setTimeout(() => {
        setError(false);
        setMessageHandler("");
      }, 2000);
    }
  };

  const acceptEventHandler = async (eventId) => {
    try {
      await api.post(
        `/registration/${eventId}/approvals`,
        {},
        { headers: { user } }
      );
      setEventRequestSuccess(true);
      setEventRequestMessage("Event approved successfully");
      removeNotificationFromDashboard(eventId);
      setTimeout(() => {
        setEventRequestSuccess(false);
        setEventRequestMessage("");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const rejectEventHandler = async (eventId) => {
    await api.post(
      `/registration/${eventId}/rejections`,
      {},
      { headers: { user } }
    );
    setEventRequestSuccess(true);
    setEventRequestMessage("Event rejected successfully");
    removeNotificationFromDashboard(eventId);
    setTimeout(() => {
      setEventRequestSuccess(false);
      setEventRequestMessage("");
    }, 2000);
  };

  const removeNotificationFromDashboard = (eventId) => {
    const newEvents = eventsRequests.filter((event) => event._id !== eventId);
    setEventsRequest(newEvents);
  };

  return (
    <>
      <Container className="mt-4">
        <ul className="notifications">
          {eventsRequests.map((request) => {
            return (
              <li key={request._id}>
                <div>
                  <strong>{request.user.email}</strong> is requesting to
                  register to your event &nbsp;
                  <strong>{request.event.title}</strong>
                </div>
                <ButtonGroup>
                  <Button
                    color="secondary"
                    onClick={() => acceptEventHandler(request._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => rejectEventHandler(request._id)}
                  >
                    Reject
                  </Button>
                </ButtonGroup>
              </li>
            );
          })}
        </ul>
        {eventRequestSuccess ? (
          <Alert className="event-validation" color="success">
            {eventRequestMessage}
          </Alert>
        ) : (
          ""
        )}
      </Container>
      <Container className="mt-4">
        <div className="filter-panel">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle color="primary" caret>
              Filter
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => filterHandler(null)}
                active={rSelected === null}
              >
                All Sports
              </DropdownItem>
              <DropdownItem
                onClick={myEventHandler}
                active={rSelected === "myevents"}
              >
                My Events
              </DropdownItem>
              <DropdownItem
                onClick={() => filterHandler("running")}
                active={rSelected === "running"}
              >
                Running
              </DropdownItem>
              <DropdownItem
                onClick={() => filterHandler("cycling")}
                active={rSelected === "cycling"}
              >
                Cycling
              </DropdownItem>
              <DropdownItem
                onClick={() => filterHandler("swimming")}
                active={rSelected === "swimming"}
              >
                Swimming
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {error ? (
          <Alert className="event-validation" color="danger">
            {messageHandler}
          </Alert>
        ) : (
          ""
        )}
        {success ? (
          <Alert className="event-validation" color="success">
            {messageHandler}
          </Alert>
        ) : (
          ""
        )}
        <ul className="events-list">
          {events.map((event) => (
            <li key={event._id}>
              <header
                style={{ backgroundImage: `url(${event.thumbnail_url})` }}
              >
                {event.user === user_id ? (
                  <div>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => deleteEventHandler(event._id)}
                    >
                      Delete
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </header>
              <strong>{event.title}</strong>
              <span>Event Date: {moment(event.date).format("l")}</span>
              <span>Event Price: {parseFloat(event.price).toFixed(2)}</span>
              <span>Event Description: {event.description}</span>
              <Button
                color="secondary"
                onClick={() => registrationRequestHandler(event)}
              >
                Registration Request
              </Button>
            </li>
          ))}
        </ul>
      </Container>
    </>

    // <Table hover className="col-sm-12 col-md-9 offset-md-1 mt-5">
    //   <thead>
    //     <tr>
    //       <th>#</th>
    //       <th>Title</th>
    //       <th>Price($)</th>
    //       <th>Description</th>
    //       <th>Date(Day/Month/Year)</th>
    //       <th>Action</th>
    //     </tr>
    //   </thead>
    //   {events.map((event) => (
    //     <tbody key={event._id}>
    //       <tr>
    //         <td
    //           style={{ backgroundImage: `url(${event.thumbnail_url})` }}
    //         />
    //         <td>{event.title}</td>
    //         <td>{event.price}</td>
    //         <td>{event.description}</td>
    //         <td>{moment(event.date).format('DD/MM/YY')}</td>
    //         <td></td>
    //       </tr>
    //     </tbody>
    //   ))}
    // </Table>
  );
}
