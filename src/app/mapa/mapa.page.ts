import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

//Google Maps Imports
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  MarkerCluster,
  MyLocation,
  Geocoder,
  GeocoderResult,
  GeocoderRequest,
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-mapa',
  templateUrl: 'mapa.page.html',
  styleUrls: ['mapa.page.scss']
})

export class MapaPage {

  map: GoogleMap;

  posLat: number = 21.382314;
  posLon: number = -157.933097;
  zoom: number = 15;

  constructor(
    private platform: Platform
  ) { }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.loadMap();
  }
//Auth




  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      'camera': {
        'target': {
          'lat': this.posLat,
          'lng': this.posLon,
        },
        'zoom': this.zoom
      }
    });
    this.addCluster(this.dummyData());
  }


  addCluster(data) {
    let markerCluster: MarkerCluster = this.map.addMarkerClusterSync({
      markers: data,
      icons: [
        {
          min: 3,
          max: 9,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 10,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    });

    markerCluster.on(GoogleMapsEvent.MARKER_CLICK)
      .subscribe((params) => {
        let marker: Marker = params[1];
        marker.setTitle(marker.get("nome"));
        marker.setSnippet(marker.get("endereco"));
        marker.showInfoWindow();
      });

  }

  //Local Atual -------------
  localAtual() {
    // this.map.clear();
    this.map.getMyLocation()
      .then(
        (location: MyLocation) => {
          //console.log(JSON.stringify(location, null, 2));
          this.zoom = 18;
          this.map.animateCamera({
            target: location.latLng,
            zoom: this.zoom,
            tilt: 30
          });
          this.map.addMarker({
            title: 'Ionic',
            snippet: 'A programação hibrida',
            icon: '#ff0000',
            animation: 'DROP',
            zoom: 15,
            position: {
              lat: location.latLng.lat,
              lng: location.latLng.lng
            }
          })
        })
  }

  //Busca endereco -----------------------------
  public endereco: string = 'Kyoto, Japan';

  async localEndereco(event) {
    let options: GeocoderRequest = {
      address: this.endereco
    };
    console.log(options);
    // Address -> latitude,longitude
    Geocoder.geocode(options).then((results: GeocoderResult[]) => {
      console.log(results);

      if (results.length > 0) {
        let marker: Marker = this.map.addMarkerSync({
          position: results[0].position,
          title: JSON.stringify(results[0].position),
          icon: '#00ee00'
        });
        this.map.animateCamera({
          target: marker.getPosition(),
          zoom: 15
        });
        marker.showInfoWindow();
      } else {
        console.log("Not found");
      }
    })
  }

  //Pega localização ---------------------
  pegaLocal() {
    this.map.on(GoogleMapsEvent.MAP_CLICK)
      .subscribe(
        res => {
          this.map.addMarker({
            title: 'Lugar',
            snippet: 'Descricao do lugar: \n lat: ' + res[0].lat + "\n lng: " + res[0].lng,
            icon: '#0000ee',
            //animation: 'drop',
            zoom: this.zoom,
            position: {
              lat: res[0].lat,
              lng: res[0].lng
            }
          })
          console.log(res);
        }
      )
  }


  //lista de lojas --------------------------
  dummyData() {
    return [
      {
        "position": {
          "lat": -22.8729204,
          "lng": -43.3388639
        },
        "nome": "Mark Barber Shop",
        "endereco": "Estrada do Portela, 99 - Loja 223 -\n Madureira, Rio de Janeiro - RJ, 21351-901",
        "icon": "assets/markercluster/marker.png"
      },
      {
        "position": {
          "lat": -22.871519,
          "lng": -43.341842
        },
        "nome": "Barbearia Criarte",
        "endereco": "Rua Firmino Fragoso, 186 \n Madureira, Rio de Janeiro - RJ, 21351-090",
        "icon": "assets/markercluster/marker.png"
      },
    {
      "position": {
        "lat": -22.884218,
        "lng": -43.356979
      },
      "nome": "Barbearia Irmãos Leal",
      "endereco": "Rua Quiririm, 716 - Vila Valqueire,\n Rio de Janeiro - RJ, 21330-650",
      "icon": "assets/markercluster/marker.png"
    },
    {
    "position": {
      "lat": -22.881313,
      "lng": -43.344846
    },
    "nome": "Barber Shop Storm Fury",
    "endereco": "Praça dos Lavradores, 216 - Madureira,\n Rio de Janeiro - RJ, 21310-190",
    "icon": "assets/markercluster/marker.png"
   },
   {
    "position": {
      "lat": -22.886082,
      "lng": -43.357904
    },
    "nome": "Barbearia Rei Arthur",
    "endereco": "Rua Sibauna, 6 - Vila Valqueire, \n Rio de Janeiro - RJ, 21330-650",
    "icon": "assets/markercluster/marker.png"
   }
    ];
  }
}