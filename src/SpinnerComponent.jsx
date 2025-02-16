import React from 'react';
import { HashLoader } from 'react-spinners';

function SpinnerComponent({ loading }) {
if (!loading) return null;
return (
<div style={{
position: 'fixed',
top: 0,
left: 0,
width: '100%',
height: '100%',
backgroundColor: 'rgba(255, 255, 255, 0.7)',
zIndex: 1000,
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
flexWrap: 'wrap' // agregué esta línea para que se ajusten horizontalmente
}}>

<HashLoader color="#36d7b7" size={50} loading={loading} style={{ margin: 20 }} />
<HashLoader color="#dec518" size={50} loading={loading} style={{ margin: 20 }} />
<HashLoader color="#187edb" size={50} loading={loading} style={{ margin: 20 }} />
<HashLoader color="#db1818" size={50} loading={loading} style={{ margin: 20 }} />
</div>
);
}
export default SpinnerComponent;