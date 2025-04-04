import styled from '@emotion/styled'

export const LayerPanel = styled.div`
  width: 200px;
  background: #1e1e1e;
  color: #fff;
  padding: 10px;
  font-family: sans-serif;
  overflow-y: auto;
  max-height: 90vh;
  ${'' /* border: 10px solid red; */}
`;

export const LayerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
  border: 1px solid #333;
  margin-bottom: 6px;
  cursor: pointer;
  background: ${({ active }) => (active ? '#3a3a3a' : '#2a2a2a')};
  border-left: ${({ active }) => (active ? '3px solid #00f2ff' : 'none')};
`;

export const LayerPreview = styled.div`
  width: 30px;
  height: 30px;
  background-size: cover;
  margin-right: 8px;
`;

export const LayerActions = styled.div`
  button {
    margin-left: 4px;
    cursor: pointer;
    background: none;
    border: none;
    color: white;
  }
`;
