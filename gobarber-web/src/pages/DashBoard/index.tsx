import React, { useCallback, useEffect, useMemo, useState } from "react";
import {Container, Header, HeaderContent, Profile, Content, Schedule, NextAppointment, Calendar, Section, Appointment } from'./styles';
import { FiClock, FiPower } from "react-icons/fi";
import { useAuth } from "../../hooks/auth";
import DayPicker, { DayModifiers } from 'react-day-picker';
import {isToday, format} from "date-fns";

import ptBR from "date-fns/esm/locale/pt-BR";
import 'react-day-picker/lib/style.css';
import logo from '../../assets/logo.svg';
import api from "../../services/api";


interface MonthAvailabilityItem{
    day: number;
    available: boolean;
}

interface Appointment{
    id: string;
    date: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const DashBoard: React.FC = () => {

    const {user, signOut} = useAuth()
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available) {
            setSelectedDate(day);
        }
    }, [])

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, [])

    useEffect(() => {
        api
        .get(`/providers/${user.id}/month-availability`, {
            params:{
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            }})
        .then(response => setMonthAvailability(response.data));
      }, [currentMonth]);

    // useEffect(() =>{
    //     api.get(`/providers/${user.id}/day-availability`, {
    //         params:{
    //             day: selectedDate.getDate(),
    //             month: selectedDate.getMonth() + 1,
    //             year: selectedDate.getFullYear(),
    //         }
    //     }).then(response => {
    //         setAppointments(response.data); 
    //         console.log(response.data)
    //     })
    // }, [selectedDate])

    useEffect(() =>{
        api.get(`/appointments/me`, {
            params:{
                day: selectedDate.getDate(),
                month: selectedDate.getMonth() + 1,
                year: selectedDate.getFullYear(),
            }
        }).then(response => {
            setAppointments(response.data); 
            console.log(response.data)
        })
    }, [selectedDate])

    const selectedDateAsText = useMemo( () => {
        return format(selectedDate, " 'Dia' dd 'de' MMMM ", {locale: ptBR})
    }, [selectedDate])

    const selectedWeekDateAsText = useMemo(() => {
        return format(selectedDate, 'cccc', {locale: ptBR})
    }, [selectedDate])

    const disabledDays = useMemo(() => {
        const dates = monthAvailability
        .filter(monthDay => monthDay.available === false)
        .map(monthDay => {
            const year = currentMonth.getFullYear()
            const month = currentMonth.getMonth() + 1
            
            return new Date(year, month, monthDay.day);
        })
        return dates;
    }, [currentMonth, monthAvailability])

    return(
        <Container > 
            <Header>
                <HeaderContent>
                    <img src={logo} alt="Logo GoBarber" />
                    <Profile>
                        <img src={user.avatar} alt="Name" />
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
                        {isToday(selectedDate) && <span>Hoje</span>}
                        <span>{selectedDateAsText}</span>
                        <span>{selectedWeekDateAsText}</span>
                    </p>
                    <NextAppointment>
                        <strong>Atendimento a seguir</strong>
                        <div>
                            <img src="https://st2.depositphotos.com/39397496/48137/i/450/depositphotos_481373648-stock-photo-beautiful-black-american-woman-profile.jpg" alt="Name" />
                            <strong>Gabriela Gonzaga</strong>
                            <span>
                                <FiClock/>
                                09:00
                            </span>
                        </div>
                    </NextAppointment>

                    <Section>
                        <strong>Manhã</strong>
                        <Appointment>
                            <span> <FiClock/> 15:00</span>
                            <div>
                                <img src="https://st2.depositphotos.com/39397496/48137/i/450/depositphotos_481373648-stock-photo-beautiful-black-american-woman-profile.jpg" alt="Name" />
                                <strong>{user.name}</strong>
                            </div>
                        </Appointment>
                        <Appointment>
                            <span> <FiClock/> 15:00</span>
                            <div>
                                <img src="https://st2.depositphotos.com/39397496/48137/i/450/depositphotos_481373648-stock-photo-beautiful-black-american-woman-profile.jpg" alt="Name" />
                                <strong>{user.name}</strong>
                            </div>
                        </Appointment>
                    </Section>

                    <Section>
                        <strong>Tarde</strong>
                        <Appointment>
                            <span> <FiClock/> 15:00</span>
                            <div>
                                <img src="https://st2.depositphotos.com/39397496/48137/i/450/depositphotos_481373648-stock-photo-beautiful-black-american-woman-profile.jpg" alt="Name" />
                                <strong>{user.name}</strong>
                            </div>
                        </Appointment>
                    </Section>
                </Schedule>

                <Calendar>
                    <DayPicker
                        weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                        fromMonth={new Date()}
                        disabledDays={[
                            {daysOfWeek: [0, 6], ...disabledDays}
                        ]}
                        selectedDays={selectedDate}
                        modifiers={{
                            available: {daysOfWeek: [1, 2, 3, 4, 5]}
                        }}
                        onDayClick={handleDateChange}
                        onMonthChange={handleMonthChange}
                        months={[
                            'Janeiro',
                            'Fevereiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro',
                        ]}
                    />
                </Calendar>
            </Content>
        </Container> 
    )
};

export default DashBoard;