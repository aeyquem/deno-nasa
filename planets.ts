import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std/io/mod.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";

type Planet = Record<string, string>;

export function filterHabitablePlanets(data: Planet[]) {
  const planets = (data as Array<Planet>).filter((planet) => {
    const disposition = planet["koi_disposition"];
    const planetRadius = Number(planet["koi_prad"]);
    const stellarMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);

    return disposition === "CONFIRMED" &&
      planetRadius > 0.5 && planetRadius < 1.5 &&
      stellarMass > 0.78 && stellarMass < 1.04 &&
      stellarRadius > 0.99 && stellarRadius < 1.01;
  });

  return planets;
}

async function loadPlanetsData(): Promise<Planet[]> {
  const path = join(Deno.cwd(), "data/exoplanets.csv");
  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const data = await parse(bufReader, {
    header: true,
    comment: "#",
  });

  file.close();

  return filterHabitablePlanets(data as Planet[]);
}

export const planets: Array<Planet> = await loadPlanetsData();
