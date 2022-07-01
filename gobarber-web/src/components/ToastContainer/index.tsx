import React from 'react';
import { Container } from './styles';
import {ToastMessage} from '../../hooks/toast';
import Toast from './Toast';
import { useTransition }from 'react-spring'
import { opacify } from 'polished';

interface ToastContainerProps{
    messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({messages}) =>{

    const messagesWithTransitions = useTransition(messages, {
        keys: (message) => message.id,
        from: { right: '-120%', opacity: 0 },
        enter: { right: '0%', opacity: 1 },
        leave: { right: '-120%', opacity: 0 } ,
    }) 

    return(
        <Container>
            {messagesWithTransitions((style, item) => (
            <Toast style={style} key={item.id} message={item} />
            ))}
      </Container>
    );
};

export default ToastContainer;