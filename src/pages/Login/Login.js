import React, { useContext, useState } from "react";
import api from "../../services/api";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Alert,
} from "reactstrap";
import { UserContext } from "../../user-context";

const Login = ({ history }) => {
  const { setIsLoggedIn } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("false");

  const submit = async (evt) => {
    evt.preventDefault();
    const response = await api.post("/login", { email, password });
    const user_id = response.data.user_id || false;
    const user = response.data.user || false;

    try {
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
          setErrorMessage("");
        }, 2000);
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error);
    }
  };

  return (
    <Container>
      <Form onSubmit={submit} className="col-sm-12 col-md-6 offset-md-3 mt-5">
        <h3>Login</h3>
        <p>
          Please <strong>Login</strong> into your account
        </p>
        {error ? (
          <Alert className="event-validation" color="danger">
            {errorMessage}
          </Alert>
        ) : (
          ""
        )}

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
          <Button className="mb-2">Submit</Button>
          <br />
          <Button
            onClick={() => history.push("/register")}
            className="btn btn-info"
          >
            New Account
          </Button>
        </FormGroup>
      </Form>
    </Container>
  );
};
export default Login;
