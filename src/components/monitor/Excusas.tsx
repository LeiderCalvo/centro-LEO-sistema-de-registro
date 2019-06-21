import React, { Component } from 'react';
import { observer } from 'mobx-react';
import '../../styles/Excusas.css';
import store from '../../stores/store';
import DataBaseFireBase from '../../utils/DataBaseFireBase';
import Dropzone from 'react-dropzone';
import StorageFireBase from '../../utils/StorageFireBase';

@observer
class Excusas extends Component<any, any> {

    constructor(props: any){
        super(props);
        this.state = {
            razon: '',
            fecha: '',
            inicio: '',
            fin: '',
            file: null,
            isDropZoneActive: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.addExcuse = this.addExcuse.bind(this);
    }

    componentDidMount(){
        DataBaseFireBase.getExcuces(store.currentUser.nombre);
    }

    handleClick(){
        
        if(this.state.razon === '' || this.state.fecha === '' || this.state.inicio === '' || this.state.fin === ''){
            store.displayToast('Porfavor llene todos los campos', 'warning');
            return;
        }
        
        let plaso = new Date();
        plaso.setHours(this.state.inicio.split(':')[0]);
        plaso.setMonth(parseInt(this.state.fecha.split('-')[1]) - 1);
        plaso.setDate(this.state.fecha.split('-')[2]);
        plaso.setMinutes(this.state.inicio.split(':')[1])
        
        if(Math.abs(plaso.getTime() - Date.now()) <= 172800000){
            store.displayToast('La fecha es muy proxima, debe tener dos días minimo de anticipación', 'error');
            return;
        }

        let date = Date.now();
        if(this.state.file){
            StorageFireBase.uploadImg(date, this.state.file, this.addExcuse);
        }else{
            this.addExcuse(date, '');
        }
    }

    addExcuse(date: number, download: string){
        DataBaseFireBase.addNewExcuse(date, {razon: this.state.razon, fecha: this.state.fecha, inicio: this.state.inicio, fin: this.state.fin, url: download});
        DataBaseFireBase.setRegistro(DataBaseFireBase.transfomTimeToNumber(store.fecha.hora+':'+store.fecha.minutos), this.state.fecha, 'excusa');
        this.setState({razon: '', fecha: '', inicio: '', fin: '', file: null, isDropZoneActive: false});
    }

    render(){
        return(
            <div className="workArea Excusas">
                <input type="text" placeholder='Razón de la falta' id='inp0' value={this.state.razon}
                onChange={(e)=>{
                    this.setState({razon :e.target.value + ''});
                }}/>

                <div className="inps-cont">
                    <div className="label-cont" id='esp'>
                        <h3 className='label'>Fecha</h3>
                        <input type="date" value={this.state.fecha}
                        onChange={(e)=>{
                            this.setState({fecha :e.target.value + ''});
                        }}/>
                    </div>

                    <div className="label-cont">
                        <h3 className='label'>Desde</h3>
                        <input type="time" value={this.state.inicio}
                        onChange={(e)=>{
                            this.setState({inicio :e.target.value + ''});
                        }}/>
                    </div>

                    <div className="label-cont">
                        <h3 className='label'>Hasta</h3>
                        <input type="time" value={this.state.fin}
                        onChange={(e)=>{
                            this.setState({fin :e.target.value + ''});
                        }}/>
                    </div>
                </div>

                <div className="soporte-cont" style={this.state.isDropZoneActive === false? {marginBottom: '15%'}:{marginBottom: '5%'}}>
                    {this.state.isDropZoneActive === false? 
                        <h3 onClick={()=>{
                            this.setState({isDropZoneActive: true});
                        }}>Subir soporte fotográfico</h3>
                    :
                        <Dropzone onDrop={(acceptedFiles) => {
                            var reader = new FileReader();
                            reader.onload = (e: any) => {
                                this.setState({file : e.target.result});
                            }
                            reader.readAsDataURL(acceptedFiles[0]);
                        }}>

                            {({getRootProps, getInputProps}) => (
                                <section className='dropZone'>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {this.state.file === null && <p>Drag and drop zone</p>}
                                    </div>
                                    {this.state.file && <div className='img-container'><img alt='temp' src={this.state.file}/></div>}
                                </section>
                            )}

                        </Dropzone>
                    }

                    <div className="btn" onClick={this.handleClick}>Send</div>

                </div>

                <h2 className='titulo'>Anteriores</h2>
                <div className="anteriores">
                    <div className="exc-row">
                        <p className="id tit">#</p>
                        <p className="razon tit">Rrazón</p>
                        <p className="fecha tit">Fecha</p>
                        <p className="inicio tit">Inicio</p>
                        <p className="fin tit">Fin</p>
                    </div>

                    {store.excusas.map((elem, index)=>{
                        return <div key={index+'excuces'} className="exc-row">
                            <p className="id item">{index}</p>
                            <p className="razon item">{elem.razon}</p>
                            <p className="fecha item">{elem.fecha}</p>
                            <p className="inicio item">{elem.inicio}</p>
                            <p className="fin item">{elem.fin}</p>
                        </div> 
                    })}
                </div>
            </div>
            );
    }
}

export default Excusas;