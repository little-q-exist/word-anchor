import { Link, Outlet } from 'react-router';

const Background = () => {
    return (
        <div>
            <h1>Recite Word App</h1>
            <ul>
                <li>
                    <Link to={`/learn`}>LEARN</Link>
                </li>
                <li>
                    <Link to={`/login`}>LOGIN</Link>
                </li>
            </ul>
            <Outlet />
        </div>
    );
};

export default Background;
