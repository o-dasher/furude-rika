import DroidPPBoardPP from '@furude-osu/API/DroidPPBoardPP';

interface Skills {
  speed: number;
  aim: number;
  extra: number;
}

class DBDroidUser {
  username: string = '';
  dpp: DroidPPBoardPP = { total: 0, list: [] };
  skills: Skills = {
    speed: 0,
    aim: 0,
    extra: 0
  };
}

export default DBDroidUser;
export { Skills };
