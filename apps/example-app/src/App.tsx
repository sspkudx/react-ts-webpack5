import { PureComponent, type ErrorInfo } from 'react';
import { formatNumber } from '@react-app/shared';
import style from './_style.module.scss';

class App extends PureComponent {
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log(error);
        console.log(errorInfo);
    }

    render() {
        // 演示 workspace 联调：dev 下经 exports development 条件直读 shared 源码（热更新）
        const message = `Hello ${formatNumber(123.456, 1)}`;
        return <p className={style.testerApp}>{message}</p>;
    }
}

export default App;
