import React, { useState, useEffect } from "react";
import api from "../../services/api";
import moment from "moment";
import { ButtonGroup, Button, Container } from "reactstrap";
import "./style.css";

export default function MyRegistration() {
  const [myEvents, setMyEvents] = useState([]);
  const user = localStorage.getItem("user");

  // useEffect(() => {
  //   getMyEvents();
  // }, []);

  const getMyEvents = async () => {
    try {
      const response = await api.get("/registration", { headers: { user } });
      setMyEvents(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(getMyEvents, [])

  const isApproved = (approved) =>
    approved === true ? "Approved" : "Rejected";

  const acceptEventHandler = async (eventId) => {
    try {
      await api.post(
        `/registration/${eventId}/approvals`,
        {},
        { headers: { user } }
      );
      getMyEvents();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectEventHandler = async (eventId) => {
    try {
      await api.post(
        `/registration/${eventId}/rejections`,
        {},
        { headers: { user } }
      );
      getMyEvents();
    } catch (error) {}
  };

  return (
    <Container>
      <ul className="events">
        {myEvents.map((event) => (
          <li key={event._id}>
            <div>
              <strong> {event.eventTitle}</strong>
            </div>
            <div className="events-detail">
              <span>Event Date: {moment(event.eventDate).format("l")}</span>
              <span>
                Event Price: $ {parseFloat(event.eventPrice).toFixed(2)}
              </span>
              <span>User Email: {event.userEmail}</span>
              <span>
                Status:
                <span
                  className={
                    event.approved !== undefined
                      ? isApproved(event.approved)
                      : "Panding"
                  }
                >
                  {event.approved !== undefined
                    ? isApproved(event.approved)
                    : "Padding"}
                </span>
              </span>
              <ButtonGroup>
                <Button
                  disabled={
                    event.approved === true || event.approved === false
                      ? true
                      : false
                  }
                  outline
                  color="secondary"
                  onClick={() => acceptEventHandler(event._id)}
                >
                  Accept
                </Button>
                <Button
                  disabled={
                    event.approved === true || event.approved === false
                      ? true
                      : false
                  }
                  outline
                  color="danger"
                  onClick={() => rejectEventHandler(event._id)}
                >
                  Reject
                </Button>
              </ButtonGroup>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
