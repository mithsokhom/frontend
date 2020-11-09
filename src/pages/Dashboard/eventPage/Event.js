import React, { useState, useMemo, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import cameraIcon from "../../../assets/camera.png";
import api from "../../../services/api";
import "./events.css";

export default function Event({ history }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [sport, setSport] = useState("Sport");
  const [date, setDate] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setOpen] = useState(false);
  const user = localStorage.getItem("user");

  // useEffect(() => {
  //   if (!user) history.push("/login");
  // }, [user]);

  const toggle = () => setOpen(!dropdownOpen);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  const submit = async (evt) => {
    evt.preventDefault();
    const eventData = new FormData();
    eventData.append("thumbnail", thumbnail);
    eventData.append("sport", sport);
    eventData.append("title", title);
    eventData.append("price", price);
    eventData.append("description", description);
    eventData.append("date", date);

    try {
      if (
        title !== "" &&
        description !== "" &&
        sport !== "Sport" &&
        date !== "" &&
        thumbnail !== null
      ) {
        await api.post("/event", eventData, { headers: { user } });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          history.push("/");
        }, 2000);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 2000);
      }
    } catch (error) {
      Promise.reject(error);
      console.log(error);
    }
  };

  const sportEventHandler = (sport) => {
    setSport(sport);
  };

  return (
    <Container>
      <Form onSubmit={submit} className="col-sm-12 col-md-6 offset-md-3 mt-5">
        <h3>Create Your Event</h3>
        {error ? (
          <Alert className="event-validation" color="danger">
            Missing required information
          </Alert>
        ) : (
          ""
        )}
        {success ? (
          <Alert className="event-validation" color="success">
            The event was created successfully
          </Alert>
        ) : (
          ""
        )}

        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label className="mr-sm-2">Upload Image</Label>
          <Label
            id="thumbnail"
            className={thumbnail ? "has-thumbnail" : ""}
            style={{ backgroundImage: `url(${preview})` }}
          >
            <Input
              type="file"
              onChange={(evt) => setThumbnail(evt.target.files[0])}
            />
            <img
              src={cameraIcon}
              style={{ maxWidth: "50px" }}
              alt="upload icon"
            />
          </Label>
        </FormGroup>

        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="title" className="mr-sm-2">
            Event Title
          </Label>
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Event Title"
            className="mb-2"
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="description" className="mr-sm-2">
            Event Description
          </Label>
          <Input
            type="text"
            name="description"
            id="description"
            placeholder="Event Description"
            className="mb-2"
            value={description}
            onChange={(evt) => setDescription(evt.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="price" className="mr-sm-2">
            Event Price
          </Label>
          <Input
            type="text"
            name="price"
            id="price"
            placeholder="Event Price $0.00"
            className="mb-2"
            value={price}
            onChange={(evt) => setPrice(evt.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="date" className="mr-sm-2">
            Event Date
          </Label>
          <Input
            type="date"
            name="date"
            id="date"
            placeholder="Event Date"
            className="mb-2"
            value={date}
            onChange={(evt) => setDate(evt.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <ButtonDropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            className="mb-4"
          >
            <Button id="caret" color="warning" value={sport} disabled>
              {sport}
            </Button>
            <DropdownToggle caret color="info" />
            <DropdownMenu>
              <DropdownItem onClick={() => sportEventHandler("running")}>
                running
              </DropdownItem>
              <DropdownItem onClick={() => sportEventHandler("cycling")}>
                cycling
              </DropdownItem>
              <DropdownItem onClick={() => sportEventHandler("swimming")}>
                swimming
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </FormGroup>
        <FormGroup>
          <Button type="submit" className="mb-2">
            Create Event
          </Button>
          <br />
          <Button onClick={() => history.push("/")} className="btn btn-info">
            Cancel
          </Button>
        </FormGroup>
      </Form>
    </Container>
  );
}
