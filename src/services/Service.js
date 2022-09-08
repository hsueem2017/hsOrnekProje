import axios from 'axios';
import { gql } from "@apollo/client";

const REST_API_URL = ""

export async function upload(data) {
    return (await axios.post(REST_API_URL + '/upload', data)).data;
}

export const personel_query = gql`
query {
    allPersonel {
      id
      ad
      soyad
      anaAd
      babaAd
      medeniDurumNavigation {
        kodAck
      }
    }
  }
`

export const single_personel_query = gql`
query ($id: Int!) {
    singlePersonel(id: $id) {
       id
       ad
       soyad
       foto
       anaAd
       babaAd
       medeniDurum
       kanGrup
       birimId
       gorevId
     }
 }
`
export const kodlar_query = gql`
query ($tablo: String!) {
    kodlar(tablo: $tablo) {
       id
       tablo
       kod
       kodAck
    }
}
`
export const birim_query = gql`
query {
    birim {
       id
       ad
       zindex
    }
 }
`
export const gorev_query = gql`
query {
    gorev {
       id
       ad
       zindex
    }
 }
`
export const egitim_query = gql`
query ($id: Int!) {
    allEgitim(id: $id) {
       id
       okulId
       bolumId
       personelId
       tur
       diplomaNo
       mezuniyet
    }
 }
`
export const okul_query = gql`
query {
    okul {
       id
       ad
    }
 }
`
export const bolum_query = gql`
query {
    bolum {
       id
       ad
    }
 }
`

export const save_personel_query = gql`
  mutation createPersonel (   
    $ad: String!,
    $soyad: String!,
    $foto: String!,
    $medeniDurum: String!,
    $kanGrup: String!,
    $babaAd: String!,
    $anaAd: String!,
    $birimId: String!,
    $gorevId: String!
) {
    createPersonel ( data: {
    ad: $ad,
    soyad: $soyad,
    foto: $foto,
    medeniDurum: $medeniDurum,
    kanGrup: $kanGrup,
    babaAd: $babaAd,
    anaAd: $anaAd,
    birimId: $birimId,
    gorevId: $gorevId })
    {
        personel {
            id
          }
    }
    }
`;

export const update_personel_query = gql`
mutation updatePersonel ($patch: PersonelUpdateDataInput!) {
    updatePersonel (data: $patch) {
      personel {
        id
        ad
        soyad
        foto
        medeniDurum
        kanGrup
        babaAd
        anaAd
        birimId
        gorevId
      }
    }
  }
`;

export const save_egitim_query = gql`
  mutation createEgitim (   
    $okulId: String!,
    $bolumId: String!,
    $personelId: String!,
    $tur: String!,
    $diplomaNo: String!,
    $mezuniyet: String!
) {
    createEgitim ( data: {
        okulId: $okulId,
        bolumId: $bolumId,
        personelId: $personelId,
        tur: $tur,
        diplomaNo: $diplomaNo,
        mezuniyet: $mezuniyet })
    {
        egitim {
            id
          }
    }
    }
`;

export const update_egitim_query = gql`
mutation updateEgitim ($patch: EgitimUpdateDataInput!) {
    updateEgitim (data: $patch) {
        egitim {
            id
            okulId
            bolumId
            personelId
            tur
            diplomaNo
            mezuniyet
        }
    }
  }
`;

export const delete_personel_query = gql`
mutation deletePersonel ($id: String!) {
    deletePersonel (id: $id) {
      id
    }
  }
`;

export const delete_egitim_query = gql`
mutation deleteEgitim ($id: String!) {
    deleteEgitim (id: $id) {
      id
    }
  }
`;

export const login_query = gql`
mutation login ($input: LoginDtoInput!) {
    login (loginDto: $input) {
      username
      token
    }
  }
`;

export const register_query = gql`
mutation register ($input: RegisterDtoInput!) {
    register (registerDto: $input) {
      username
      token
    }
  }
`;

/*export const upload_query = gql`
mutation ($input : UploadInput!) {
  upload(input: $input) {
    fileDto {
      filePath
    }
  }
}
`;*/

export const upload_query = gql`
mutation($input : Upload!) {
  upload(file: $input) {
    filePath
  }
}
`;