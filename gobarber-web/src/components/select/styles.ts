import styled, {css} from "styled-components";
import Tooltip from '../Tooltip';

interface ContainerProps{
    isFocused: boolean;
    isFilled: boolean;
    isErrored: boolean;
}


export const Container = styled.div<ContainerProps>`
    background-color: #232129;
    border-radius: 10px;
    border: 2px solid #232129; 
    padding: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    color: #666360;
    
    & + div{
        margin-top: 8px;
    } 
    
    ${props => props.isErrored && css`
        border-color: #c53030;
    `}

    ${props => props.isFocused && css`
        color: #ff9000;
        border-color: #ff9000;
    `}

    ${props => props.isFilled && css`
        color: #ff9000;
    `}

   

    select{
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #f4ede8;
        font-family: 'Roboto Slab',serif;
        font-size: 16px;

        &::placeholder{
            color: #666360;
        }

        select:-webkit-autofill,
        select:-webkit-autofill:hover,
        select:-webkit-autofill:focus,
        select:-webkit-autofill:active {
            transition: background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s;
            transition-delay: background-color 5000s, color 5000s;
        }

        option{
            background: #232129;
            color: #AFAFAF;

            &:hover{
                background-color: #3e3b47;
            }
        }
    }

    svg{
        margin-right: 16px;
    }
`;

export const Error = styled(Tooltip)`
    height: 20px;
    margin-left: 16px;

    svg{
        margin: 0;
    }

    span{
        background: #c53030;
        color: white;

        &::before {
        border-color: #c53030 transparent;
        }
    }
`;