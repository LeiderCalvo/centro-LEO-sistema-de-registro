import React from 'react';
import { observer } from 'mobx-react';
import DataBaseFireBase from '../utils/DataBaseFireBase';
import store from '../stores/store';

@observer
class Slider extends React.Component<any,any> {
    constructor(props: any) {
        super(props);
        this.state = {
            pos:0,
            op: 1
        }
    }

    handleClick(val: string){
        let temp = 0;
        val === 'back'? temp = this.state.pos-1 : temp = this.state.pos+1;
        if(temp < store.excusas.length && temp>=0){
            this.setState({op: 0});

            setTimeout(() => {
                this.setState({pos: temp, op: 1});
            }, 700);
        }

    }

    render(){
        return(
            store.excusas.length>=1 && store.excusas[this.state.pos] !== null && store.excusas[this.state.pos] !== undefined ?
                <div className="Slider" style={store.excusas.length>1?{justifyContent:'space-between'}:{justifyContent: 'center'}}>
                    {store.excusas.length>1&&<button onClick={()=>this.handleClick('back')}>{'<'}</button>
                    }
                    <div className="excusa" style={{opacity: this.state.op}}>
                        <p id='fecha'>{store.excusas[this.state.pos].fecha+', '+DataBaseFireBase.transfomNumberToTime(store.excusas[this.state.pos].inicio)+' - '+DataBaseFireBase.transfomNumberToTime(store.excusas[this.state.pos].fin)}</p>
                        <p>"{store.excusas[this.state.pos].razon}".</p>
                        <p>({store.excusas[this.state.pos].monitor})</p>
                    </div>
                    {store.excusas.length>1&&
                    <button onClick={()=>this.handleClick('next')}>{'>'}</button>
                    }
                </div>
            :
                <div className="Slider"></div>

        )
    }
}

export default Slider;