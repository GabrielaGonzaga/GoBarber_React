import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { format, isAfter, isToday, parseISO } from 'date-fns';
import * as Yup from 'yup';
import { Form } from '@unform/web'
import ptBR from 'date-fns/locale/pt-BR';
import 'react-day-picker/lib/style.css';
import getValidationErrors from "../../utils/getValidationErrors";
import { FiCalendar, FiClock, FiPlusSquare, FiPower, FiUserCheck, FiXCircle } from 'react-icons/fi';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Calendar,
  Section,
  Appointment,
  NewAppointment,
  ContentCol,
} from './styles';
import { useAuth } from '../../hooks/auth';
import logoImg from '../../assets/logo.svg';
import  api  from '../../services/api';
import Button from '../../components/button';
import Input from '../../components/input';
import { FormHandles } from '@unform/core';
import { useToast } from '../../hooks/toast';
import Select from '../../components/select';

interface MonthAvailability {
  day: number;
  available: boolean;
}

interface AppointmentFormData{
  provider_id: string,
  date: Date,
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

type Appointments = Array<{
  id: string;
  date: string;
  formattedHour: string;
  user: {
    name: string;
    avatar_url: string;
  };
}>;

  const Dashboard: React.FC = () => {
    const { signOut, user } = useAuth();
    const formRef = useRef<FormHandles>(null);
    const {addToast} = useToast();
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<
      MonthAvailability[]
    >([]);
    const [appointments, setAppointments] = useState<Appointments>([]);
    const [isShown, setIsShown] = useState(false);

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
      if (modifiers.available && !modifiers.disabled) {
        setSelectedDate(day);
      }
    }, []);

    const handleMonthChange = useCallback((month: Date) => {
      setCurrentMonth(month);
    }, []);

    const disabledDays = useMemo(() => {
      const dates = monthAvailability
        .filter(monthDay => monthDay.available === false)
        .map(monthDay => {
          const year = currentMonth.getFullYear();
          const month = currentMonth.getMonth();

          return new Date(year, month, monthDay.day);
        });

      return dates;
    }, [currentMonth, monthAvailability]);

    const selectedDateAsText = useMemo(() => {
      return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR });
    }, [selectedDate]);

    const selectedWeekDay = useMemo(() => {
      return format(selectedDate, 'cccc', { locale: ptBR });
    }, [selectedDate]);

    const morningAppointments = useMemo(() => {
      return appointments.filter(appointment => {
        return parseISO(appointment.date).getHours() < 12;
      });
    }, [appointments]);

    const afternoonAppointments = useMemo(() => {
      return appointments.filter(appointment => {
        return parseISO(appointment.date).getHours() >= 12;
      });
    }, [appointments]);

    const handleClick = event => {
      setIsShown(current => !current);
      // setIsShown(true);
    };

    
    useEffect(() => {
      api.get("/providers").then((response) => {
        setProviders(response.data);
      });
    }, []);

    const handleSubmit = useCallback(async (data: AppointmentFormData) => {
      try {

        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
            provider_id: Yup.string().required('Barbeiro obrigatório'),
            date: Yup.date().required('E-mail obrigatório'),
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        await api.post('/appointments', data)

        addToast({
          type: 'sucess',
          title: 'Agendamento criado com sucesso'
        });

    } catch (err: any) {
        if(err instanceof Yup.ValidationError){
            //@ts-ignore ("Argument of type 'unknown' is not assignable to parameter of type 'ValidationError'")
            const errors = getValidationErrors(err);
            formRef.current?.setErrors(errors)
        }

        addToast({
            type: 'error',
            title: 'Erro ao criar agendamento',
            description: 'Verique os campos e tente novamente'
        });
    }
    }, [])


    // const date = useMemo(() => {
    //   return appointments.find(data =>
    //     isAfter(parseISO(data.date), new Date()),
    //   );
    // }, [data]);

    const nextAppointment = useMemo(() => {
      return appointments.find(appointment =>
        isAfter(parseISO(appointment.date), new Date()),
      );
    }, [appointments]);

    useEffect(() => {
      api
        .get(`/providers/${user.id}/month-availability`, {
          params: {
            year: currentMonth.getFullYear(),
            month: currentMonth.getMonth() + 1,
          },
        })
        .then(response => setMonthAvailability(response.data));
    }, [currentMonth, user.id]);

    useEffect(() => {
      api
        .get<Appointments>('/appointments/me', {
          params: {
            year: selectedDate.getFullYear(),
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
          },
        })
        .then(response => {
          const appointmentsFormatted = response.data.map(appointment => {
            return {
              ...appointment,
              formattedHour: format(parseISO(appointment.date), 'HH:mm'),
            };
          });

          setAppointments(appointmentsFormatted);
        });
    }, [selectedDate]);

    return (
      <>
      <Container>
        <Header>
          <HeaderContent>
            <img src={logoImg} alt="GoBarber" />
            <Profile>
              <img src={user.avatar_url} alt={user.name} />
              <div>
                <span>Bem-Vindo,</span>
                <strong>{user.name}</strong>
              </div>
            </Profile>
            <button onClick={signOut} type="button">
              <FiPower />
            </button>
          </HeaderContent>
        </Header>
        <Content>
          <Schedule>
            <h1>Horários agendados</h1>
            <p>
              {isToday(selectedDate) && <span>Hoje</span>}
              <span>{selectedDateAsText}</span>
              <span>{selectedWeekDay}</span>
            </p>

            {isToday(selectedDate) && nextAppointment && (
              <NextAppointment>
                <strong>Agendamento a seguir</strong>
                <div>
                  <img
                    src={nextAppointment?.user.avatar_url}
                    alt={nextAppointment?.user.name}
                  />
                  <strong>{nextAppointment?.user.name}</strong>
                  <span>
                    <FiClock />
                    {nextAppointment?.formattedHour}
                  </span>
                </div>
              </NextAppointment>
            )}

            <Section>
              <strong>Manhã</strong>

              {morningAppointments.length === 0 && (
                <p>Nenhum agendamento neste período</p>
              )}

              {morningAppointments
                ? morningAppointments.map(appointment => (
                    <Appointment key={appointment.id}>
                      <span>
                        <FiClock />
                        {appointment.formattedHour}
                      </span>

                      <div>
                        <img
                          src={appointment.user.avatar_url}
                          alt={appointment.user.name}
                        />
                        <strong>{appointment.user.name}</strong>
                      </div>
                    </Appointment>
                  ))
                : null}
            </Section>
            <Section>
              <strong>Tarde</strong>

              {afternoonAppointments.length === 0 && (
                <p>Nenhum agendamento neste período</p>
              )}

              {afternoonAppointments.map(appointment => (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.formattedHour}
                  </span>

                  <div>
                    <img
                      src={appointment.user.avatar_url}
                      alt={appointment.user.name}
                    />
                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              ))}
            </Section>
          </Schedule>
          <ContentCol>
            <Calendar>
              <DayPicker
                weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                fromMonth={new Date()}
                disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
                modifiers={{
                  available: { daysOfWeek: [1, 2, 3, 4, 5] },
                }}
                selectedDays={selectedDate}
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
            <Button name=""  onClick={handleClick}><FiPlusSquare/>Novo Agendamento</Button>
          </ContentCol>
        </Content>
      </Container>
       {isShown && (
        <NewAppointment>
           <FiXCircle onClick={handleClick}/>
          <Form ref={formRef} onSubmit={handleSubmit} >
            <h1>Criar novo agendamento</h1>
            <p>Preencha os campos para criar um novo agendamento</p>
            <Select name="provider_id" icon={FiUserCheck}>
                {providers.map(providers => (
                  <>
                    <option  value="" selected disabled hidden>Barbeiro</option>
                    <option  value={providers.id}>{providers.name}</option>
                  </>
                ))}
            </Select>
            <Input name="date" type="datetime-local" icon={FiCalendar} placeholder="Data e Horário"/>
            <Button type="submit">Criar</Button>
          </Form>
     </NewAppointment>
      )}
  {/* {isShown && <h1>oi</h1>} */}
  </>
    
    );
  };

export default Dashboard;