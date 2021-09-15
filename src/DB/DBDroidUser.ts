import DroidPPBoardPP from '@furude-osu/API/DroidPPBoardPP';

interface Skills {
  speed: number;
  aim: number;
}

class DBDroidUser {
  dpp: DroidPPBoardPP = { total: 0, list: [] };
  skills: Skills = {
    speed: 0,
    aim: 0
  };
}

export default DBDroidUser;
export { Skills };
