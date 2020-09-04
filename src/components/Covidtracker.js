import React, { Component } from 'react';
import Card from './Card';
import Linechart from './Linechart';
import axios from 'axios';

export class Covidtracker extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            countries : [],
            selectedCountry : '',
            fromDate : '2020-03-01',
            toDate : '2020-04-03',
            totalConfirmed : 0,
            totalRecovered : 0,
            totalDeath : 0,
            selectedCountryData : [], 
            selectedCountryConfirmedCase : [],
            selectedCountryDate : [],
            selectedCountryObj : {}
        }
    }
    componentDidMount = ()=>{
        axios.get('https://api.covid19api.com/summary')
        .then(res =>{
            this.setState({
                countries : res.data.Countries,
                totalConfirmed : res.data.Global.TotalConfirmed,
                totalRecovered : res.data.Global.TotalRecovered,
                totalDeath : res.data.Global.TotalDeaths,
            })
        })
        .catch(err => console.log(err))
    }

    countryHandler= (e) =>{
        this.setState({
            selectedCountry :  e.target.value
        })
        
    }   
    fromDateHandler= (e) =>{
        this.setState({
            fromDate :  e.target.value
        })
    }
    toDateHandler= (e) =>{
        this.setState({
            toDate :  e.target.value
        })
    }
    btnHandler = (e)=>{
        e.preventDefault();
        if(this.state.selectedCountry === ''){
            alert('Please SelectThe Country')
        }else{
            const selectedCountryObj = this.state.countries.filter(country => country.Country === this.state.selectedCountry)
            this.setState({
                selectedCountryObj : selectedCountryObj[0]
            })
        this.getDataByCountry(this.state.selectedCountry, this.state.fromDate, this.state.toDate)
        }
        
    }

    getDataByCountry = (country,from, to) =>{
        
        axios
        .get(`https://api.covid19api.com/country/${country}?from=${from}T00:00:00Z&to=${to}T00:00:00Z`)
        .then(res => this.setState({
            selectedCountryData : res.data
        }, ()=>{ 
            const confirmedCase = this.state.selectedCountryData.map(country => country.Confirmed);
            const date = this.state.selectedCountryData.map(country => country.Date.substring(0,10));
            this.setState({
                selectedCountryDate : date,
                selectedCountryConfirmedCase : confirmedCase
            })
        }))
        .catch(err => console.log(err))
    }
    render() {
        return (
            <div className='container'>
                <h1>{
                    Object.keys(this.state.selectedCountryObj).length === 0?
                    "World Wide Corona Report" :
                    `${this.state.selectedCountry}'s Corona Report`
                    }
                </h1>
                <div className='cards'>
                    <Card title='Total Confirmed' count={
                                Object.keys(this.state.selectedCountryObj).length === 0?
                                this.state.totalConfirmed :
                                this.state.selectedCountryObj.TotalConfirmed}/>
                    <Card title='Total Recovered' count={
                                Object.keys(this.state.selectedCountryObj).length === 0?
                                this.state.totalRecovered :
                                this.state.selectedCountryObj.TotalRecovered}/>
                    <Card title='Total Death' count={
                                Object.keys(this.state.selectedCountryObj).length === 0?
                                this.state.totalDeath :
                                this.state.selectedCountryObj.TotalDeaths} />
                </div>
                <form>
                    <select value={this.state.selectedCountry} onChange={this.countryHandler}>
                        <option value=''>Select country</option>
                        {
                            this.state.countries.map((country, index) => <option key={index} value={country.slug}>{country.Country}</option>)
                        }
                    </select>
                    <div className='form-flex'>
                        <div className='form-grp'>
                            <label htmlFor='from-date'>From</label>
                            <input type='date' id='from-date' value={this.state.fromDate} onChange={this.fromDateHandler} placeholder='Select From Date'/>
                        </div>
                        <div className='form-grp'>
                            <label htmlFor='to-date'>TO</label>
                            <input type='date' id='to-date' value={this.state.toDate}onChange={this.toDateHandler}/>
                        </div>
                    </div>
                    <button type='submit' className='btn' onClick={this.btnHandler}>Check</button>
                </form>
                <Linechart label={this.state.selectedCountryDate} selectedCountryData={this.state.selectedCountryConfirmedCase}/>
            </div>
        )
    }
}

export default Covidtracker
