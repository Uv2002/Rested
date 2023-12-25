import { useState } from "react";


function Button() {
    const [count, setCount] = useState(0);
    return (
        <>
            <p>Count = {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </>
    )
}

export default Button;
