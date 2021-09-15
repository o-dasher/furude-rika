import DroidPPBoardPP from '@furude-osu/API/DroidPPBoardPP';

interface Skills {
  speed: number;
  aim: number;
  rythm: number;
}

class DBDroidUser {
  dpp: DroidPPBoardPP = { total: 0, list: [] };
  skills: Skills = {
    speed: 0,
    aim: 0,
    rythm: 0
  };
}

export default DBDroidUser;
export { Skills };
