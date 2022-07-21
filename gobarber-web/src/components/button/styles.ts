import styled from "styled-components";
import { shade } from 'polished';

export const Container = styled.button`

    background-color: #ff9000;
    height: 56px;
    border-radius: 10px;
    color: #312e38;
    border: 0;
    padding: 0 16px;
    width: 100%;
    font-weight: bold;
    margin-top: 16px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover{
        background: ${shade(0.2, '#ff9000')};
    }

    svg{
        width: 20px;
        height: 20px;
        margin: 0.5rem;
    }
    
`;