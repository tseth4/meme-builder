import styled from '@emotion/styled';

export const LayerPanel = styled.div`
  width: 220px;
  background: #1e1e1e;
  color: #fff;
  padding: 12px;
  font-family: 'Inter', sans-serif;
  overflow-y: auto;
  max-height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
`;

export const LayerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border: 1px solid ${({ active }) => (active ? '#00f2ff' : '#333')};
  margin-bottom: 6px;
  cursor: pointer;
  background: ${({ active }) => (active ? '#3a3a3a' : '#2a2a2a')};
  border-left: ${({ active }) => (active ? '3px solid #00f2ff' : 'none')};
  transition: background 0.2s ease;

  &:hover {
    background: #383838;
  }
`;

export const LayerPreview = styled.div`
  width: 32px;
  height: 32px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-right: 10px;
  flex-shrink: 0;
`;

export const LayerActions = styled.div`
  display: flex;
  align-items: center;

  button {
    margin-left: 6px;
    cursor: pointer;
    background: none;
    border: none;
    color: #fff;
    opacity: 0.7;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }

    svg {
      stroke-width: 2;
    }
  }
`;

