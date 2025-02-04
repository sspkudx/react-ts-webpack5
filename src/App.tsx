import { PureComponent, type ErrorInfo } from 'react';
import style from './_style.module.scss';

// eslint-disable-next-line react/require-optimization
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
