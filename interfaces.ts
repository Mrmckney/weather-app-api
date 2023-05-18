export interface ForecastData {
    cod: string;
    message: number;
    cnt: number;
    list: ForecastDataSingle[],
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        },
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    }
}

export interface ForecastDataSingle {
    clouds: {
        all: number;
    },
    dt: number;
    dt_txt: string;
    main: {
        feels_like: number;
        grnd_level: number;
        humidity: number;
        pressure: number;
        sea_level: number;
        temp: number;
        temp_kf: number;
        temp_max: number;
        temp_min: number;
    },
    pop: number;
    sys: {
        pod: string;
    }
    visibility: number;
    weather: [{
        id: number;
        icon: string;
        main: string;
        description: string;
    }],
    wind: {
        speed: number;
        deg: number;
        gust: number
    }
}

export interface FilteredData {
    date: string;
    main: {
        min: number;
        max: number;
    };
    weather: [{
        id: number;
        icon: string;
        main: string;
        description: string;
    }];
}