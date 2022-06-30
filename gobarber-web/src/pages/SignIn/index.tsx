import React from "react";
import {Container, Content, Background} from './styles';
import {FiLogIn, FiMail, FiLock} from 'react-icons/fi'
import logo from '../../assets/logo.svg';
import Input from "../../components/input";
import Button from "../../components/button";

const SignIn: React.FC = () =>(
    <>
        <Container>
            <Content>
                <img src={logo} alt="Logo GoBarber"/>
                <form>
                    <h1>Faça seu logon</h1>
                    <Input name="email" icon={FiMail} type="email" placeholder="E-mail"/>
                    <Input name="passoword" icon={FiLock} type="password" placeholder="Senha"/>
                    <Button name=""  type="submit">Entrar</Button>
                    <a href="forgot">Esqueci minha senha</a>
                </form> 
                <a href="forgot">
                    <FiLogIn/>
                    Criar Conta
                </a>
            </Content>
            <Background/>
        </Container>
    </>
);

export default SignIn;