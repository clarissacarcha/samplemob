import regions from '../assets/JSON/PhilippineRegions/regions.json'; //{nane, reg_code}
import provinces from '../assets/JSON/PhilippineRegions/provinces.json'; //{name, reg_code, prov_code}
import municipalities from '../assets/JSON/PhilippineRegions/municipalities.json'; //{name, prov_code, mun_code}
import barangays from '../assets/JSON/PhilippineRegions/barangays.json'; //{name, prov_code, mun_code}

export const sort = (arr, sort = 'A') => {

    // A for asc
    // Z for desc

    var sorted = arr.slice(0);

    if (sort == 'A') {

        sorted.sort(function (a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });

    } else if (sort == 'Z') {

        sorted.sort(function (a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            return y < x ? -1 : y > x ? 1 : 0;
        });
    }
    return sorted;
}

export const getRegions = () => {
    return regions;

}

export const getProvinces = () => {
    return provinces;
}

export const getProvincesByRegion = (regionCode) => {
    return provinces.filter((val, i) => {
        return val.reg_code == regionCode;
    })
}

export const getMunicipalitiesByProvince = (provinceCode) => {
    return municipalities.filter((val, i) => {
        return val.prov_code == provinceCode
    })
}

export const getBarangaysByMunicipality = (municipalityCode) => {
    return barangays.filter((val, i) => {
        return val.mun_code == municipalityCode
    })
}