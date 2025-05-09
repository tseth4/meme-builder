import styled from '@emotion/styled';

// export const LayerPanel = styled.div`
//   width: 15em;
//   background: #1e1e1e;
//   color: #fff;
//   padding: 12px;
//   font-family: 'Inter', sans-serif;
//   overflow-y: auto;
//   max-height: 100vh;
//   box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
// `;

// export const LayerItem = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 8px;
//   border: 1px solid ${({ active }) => (active ? '#00f2ff' : '#333')};
//   margin-bottom: 6px;
//   cursor: pointer;
//   background: ${({ active }) => (active ? '#3a3a3a' : '#2a2a2a')};
//   border-left: ${({ active }) => (active ? '3px solid #00f2ff' : 'none')};
//   transition: background 0.2s ease;

//   &:hover {
//     background: #383838;
//   }
// `;

// export const LayerPreview = styled.div`
//   width: 32px;
//   height: 32px;
//   background-size: cover;
//   background-position: center;
//   border-radius: 4px;
//   margin-right: 10px;
//   flex-shrink: 0;
// `;

// export const LayerActions = styled.div`
//   display: flex;
//   align-items: center;

//   button {
//     margin-left: 6px;
//     cursor: pointer;
//     background: none;
//     border: none;
//     color: #fff;
//     opacity: 0.7;
//     padding: 4px;
//     display: flex;
//     align-items: center;
//     transition: opacity 0.2s ease;

//     &:hover {
//       opacity: 1;
//     }

//     svg {
//       stroke-width: 2;
//     }
//   }
// `;

export const LayerPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  flex: 1;
  overflow-y: auto;

  h4 {
    margin: 0;
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;
export const LayerItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5em;
  gap: 0.5em;
  background: ${({ active }) => (active ? '#333' : '#222')};
  border: 1px solid #444;
  border-radius: 6px;
  cursor: pointer;

  span {
    flex: 1;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    padding: 0.4em;
    gap: 0.3em;

    span {
      display: none; // hide text label to save space
    }
  }
`;
export const LayerPreview = styled.div`
  width: 36px;
  height: 36px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  background-color: #555;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;
export const LayerActions = styled.div`
  display: flex;
  gap: 0.25em;

  button {
    background: none;
    border: none;
    color: white;
    padding: 0.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      color: #00f2ff;
    }
  }

  @media (max-width: 768px) {
    gap: 0.15em;

    button svg {
      width: 14px;
      height: 14px;
    }
  }
`;
