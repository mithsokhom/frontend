import React, { useContext, useState } from "react";
import api from "../../services/api";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { UserContext } from "../../user-context";

export default function Register({ history }) {
  const { setIsLoggedIn } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("false");

  const submit = async (evt) => {
    evt.preventDefault();
    if (
      email !== "" &&
      password !== "" &&
      firstname !== "" &&
      lastname !== ""
    ) {
      const response = await api.post("/user/register", {
        email,
        password,
        firstname,
        lastname,
      });
      const user = response.data.user || false;
      const user_id = response.data.user_id || false;

      if (user && user_id) {
        localStorage.setItem("user", user);
        localStorage.setItem("user_id", user_id);
        setIsLoggedIn(true);
        history.push("/");
      } else {
        const { message } = response.data;
        setError(true);
        setErrorMessage(message);
        setTimeout(() => {
          setError(false);
          setErrorMessage(message);
        }, 2000);
      }
    } else {
      setError(true);
      setErrorMessage("You need to fill all the fields");
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 2000);
    }
  };

  return (
    <Form onSubmit={submit} className="col-sm-12 col-md-6 offset-md-3 mt-5">
      <h3>Registration</h3>
      <p>
        Please <strong>Register</strong> for a new account
      </p>
      {error ? (
        <Alert className="event-validation" color="danger">
          {errorMessage}
        </Alert>
      ) : (
        ""
      )}
      <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
        <Label for="firstname" className="mr-sm-2">
          Firstname
        </Label>
        <Input
          type="text"
          name="firstname"
          id="firstname"
          placeholder="Your Firstname"
          className="mb-2"
          onChange={(evt) => setFirstname(evt.target.value)}
        />
      </FormGroup>
      <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
        <Label for="lastname" className="mr-sm-2">
          Lastname
        </Label>
        <Input
          type="text"
          name="lastname"
          id="lastname"
          placeholder="Your lastname"
          className="mb-2"
          onChange={(evt) => setLastname(evt.target.value)}
        />
      </FormGroup>
      <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
        <Label for="email" className="mr-sm-2">
          Email
        </Label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Your Email"
          className="mb-2"
          onChange={(evt) => setEmail(evt.target.value)}
        />
      </FormGroup>
      <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
        <Label for="password" className="mr-sm-2">
          Password
        </Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Your Password"
          className="mb-2"
          onChange={(evt) => setPassword(evt.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Button>Submit</Button>
      </FormGroup>
    </Form>
  );
}
