import { RFC } from '@/types/fixed-types';
import './_style.scss';

// fix: 完全使用箭头函数
const App: RFC = () => {
    return <div className="tester">Hello World</div>;
};

export default App;
