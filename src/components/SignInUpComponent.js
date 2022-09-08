import { useMutation } from '@apollo/client';
import { Fragment, useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login_query, register_query } from '../services/Service';

export const SignInUpComponent = () => {

    const navigate = useNavigate()

    const [signin, setSignIn] = useState(true)
    const [signup, setSignUp] = useState(false)

    const [user, setUser] = useState({
        username: '',
        password: '',
    });

    const getAuth = () => {
        loginPersonel({
            variables: { input:
                {
                    username: user.username,
                    password: user.password,
                }
            }
        });
    }

    const getRegister = () => {
        registerPersonel({
            variables: { input:
                {
                    username: user.username,
                    password: user.password,
                }
            }
        });
    }

    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setUser(
            { ...user, [name]: value }
        )
    }

    const [loginPersonel, { data: loginData, loading: loading1, error: error1} ] = useMutation(login_query)

    const [registerPersonel, { data: registerData, loading: loading2, error: error2} ] = useMutation(register_query)

    useEffect(() => {
        if (loading1 === false && loginData) {
            localStorage.setItem('user', JSON.stringify(loginData.login.token)); 
            navigate('/main');
        }
    }, [loading1])

    useEffect(() => {
        if (loading2 === false && registerData) {
            setSignIn(true); 
            setSignUp(false);
            localStorage.removeItem('user')
        }
    }, [loading2])

    if (loading1 || loading2) {
        return <div>Loading...</div>
    }

    /*if (error1 || error2) {
        return <div>Error!</div>;
    }*/

    return (
        <Fragment>
            <Button onClick={() => { setSignIn(true); setSignUp(false) }}>Sign In</Button>
            <Button onClick={() => { setSignUp(true); setSignIn(false) }} style={{ marginLeft: 10 }}>Sign Up</Button>
            <Form style={{ width: 300, marginLeft: 800, marginTop: 200 }}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name='username' placeholder="Username" onChange={onChangeHandle} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name='password' placeholder="Password" onChange={onChangeHandle} />
                </Form.Group>
                {signin && <Button onClick={getAuth} variant="primary">
                    Login
                </Button>}
                {signup && <Button onClick={getRegister} variant="primary">
                    Register
                </Button>}
            </Form>
        </Fragment>
    )
}