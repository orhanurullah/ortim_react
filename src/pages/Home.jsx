import {Link} from "react-router-dom";

function Home () {
    return (
        <div>
            <h1>Home Page</h1>
            <Link to="/register">Register</Link>
            <span> OR </span>
            <Link to="/login">Login</Link>
        </div>
    );
}
export default Home;