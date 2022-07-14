import React from "react";
import {Container, Header, HeaderContent, Profile, Content, Schedule, NextAppointment, Calendar } from'./styles';
import logo from '../../assets/logo.svg';
import { FiClock, FiPower } from "react-icons/fi";
import { useAuth } from "../../hooks/auth";

const DashBoard: React.FC = () => {

    const {signOut, user} = useAuth();
    console.log(user);

    return(
        <Container > 
            <Header>
                <HeaderContent>
                    <img src={logo} alt="Logo GoBarber" />
                    <Profile>
                        <img src="https://avatars.githubusercontent.com/u/73176744?v=4" alt={user.name} />
                        <div>
                            <span>Bem vindo,</span>
                            <strong>{user.name}</strong>
                        </div>
                    </Profile>
                    <button type="button" onClick={signOut}> 
                        <FiPower/>
                    </button>
                </HeaderContent>
            </Header>
            <Content>
                <Schedule>
                    <h1>Horários Agendados</h1>
                    <p>
                        <span>Hoje</span>
                        <span>Dia 14</span>
                        <span>Quinta-Feira</span>
                    </p>
                    <NextAppointment>
                        <strong>Atendimento a seguir</strong>
                        <div>
                            <img src="https://avatars.githubusercontent.com/u/73176744?v=4" alt="Name" />
                            <strong>Gabriela Gonzaga</strong>
                            <span>
                                <FiClock/>
                                09:00
                            </span>
                        </div>
                    </NextAppointment>
                    <Calendar>
                    </Calendar>
                </Schedule>
            </Content>
        </Container> 
    )
};

export default DashBoard;