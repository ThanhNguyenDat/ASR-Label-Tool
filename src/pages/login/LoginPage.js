import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Label, Button, CardBody, FormGroup, Form, Input } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Store } from 'react-notifications-component';
import { withPromiseAndDispatch } from '@helpers';

import { signInAsync } from '@redux/auth/authActions';

import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';

const SignInSchema = Yup.object().shape({
  username: Yup.string().required('Please enter your username'),
  password: Yup.string().required('Please enter your password'),
});

const Login = ({ history }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signIn = ctx => withPromiseAndDispatch(signInAsync, ctx, dispatch);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: SignInSchema,
    onSubmit: async values => {
      // console.log("user pass: ", values);
      // Store.removeNotification(); //bug
      try {
        const result = await signIn(values);
        console.log('logined: ', result);
        // history.push('/react_label_ui'); // ??? what is history?
        // console.log("history: ", history)
        // navigate("/react_label_ui") // redirect /react_label_ui
      } catch (err) {
        Store.addNotification({
          title: 'Error!',
          message: err?.error_message ?? 'System error. Please try again.',
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 2000,
          },
        });
      }
    },
  });

  useEffect(() => {
    formik.setErrors({});
  }, [formik.values]);

  const _handleKeyDown = e => {
    console.log(e);
    if (e.keyCode === 13) {
      e.preventDefault(); // Ensure it is only this code that runs
      formik.handleSubmit();
    }
  };

  return (
    <div id="app-container">
      <div className="container-fluid">
        <div className="h-100">
          <div className={styles.loginWrapper}>
            <Card className={styles.formContent}>
              <CardBody>
                <h4 className="mb-4">Login to Zalo AILab Tools</h4>
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup>
                    <Label className="d-block">User name</Label>
                    <Input
                      className="form-control"
                      name="username"
                      placeholder="Enter username ..."
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onKeyDown={_handleKeyDown}
                    />
                    {formik.errors.username && formik.touched.username && (
                      <div className="invalid-feedback d-block">{formik.errors.username}</div>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label className="d-block">Password</Label>
                    <Input
                      className="form-control"
                      name="password"
                      type="password"
                      placeholder="Enter password ..."
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onKeyDown={_handleKeyDown}
                    />
                    {formik.errors.password && formik.touched.password && (
                      <div className="invalid-feedback d-block">{formik.errors.password}</div>
                    )}
                  </FormGroup>

                  <Button color="secondary" block onClick={formik.handleSubmit}>
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
