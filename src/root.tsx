import { Outlet } from 'react-router';

const App = () => {
    return (
        <div>
            <div>Recite Word App</div>
            <Outlet />
        </div>
    );
};

export default App;
