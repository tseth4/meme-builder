const ColorPicker = ({ value, onChange }) => {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
      Text Color:
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 30, height: 30, border: 'none' }}
      />
    </label>
  );
};

export default ColorPicker;