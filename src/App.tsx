import { PureComponent, type ErrorInfo } from 'react';
import style from './_style.module.scss';

class App extends PureComponent {
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log(error);
        console.log(errorInfo);
    }

    render() {
        return <p className={style.testerApp}>Hello</p>;
    }
}

export default App;
