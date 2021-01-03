jest.mock('../../src/conversation/lobby/entity');

jest.mock('../../src/conversation/event-store');

jest.mock('../../src/conversation/entered');
jest.mock('../../src/conversation/exited');
jest.mock('../../src/conversation/requested');

import EventStore from '../../src/conversation/event-store';
import { Agent, Lobby, eventStore } from '../../src/conversation';
import Entered from '../../src/conversation/entered';
import Exited from '../../src/conversation/exited';
import AgentNotInLobby from '../../src/conversation/agent-not-in-lobby';
import AgentAlreadyInLobby from '../../src/conversation/agent-already-in-lobby';
import Requested from '../../src/conversation/requested';

beforeEach(function () {
  (Lobby as any).mockClear();
  (EventStore as any).mockClear();
  (Entered as any).mockClear();
  (Exited as any).mockClear();
  (Requested as any).mockClear();
});

describe('agent', function () {
  let lobby: any;

  beforeEach(function () {
    new Lobby();
    lobby = (Lobby as any).mock.instances[0];
  });

  describe('if not in lobby', function () {
    test('cannot exit lobby', function () {
      expect(() => {
        const agent = new Agent();
        agent.remove(lobby);

        expect(eventStore.publish).toHaveBeenCalledTimes(1);
        expect(eventStore.publish).toHaveBeenCalledWith(
          (Exited as any).mock.instances[0],
        );
      }).toThrow(AgentNotInLobby);
    });

    test('can enter lobby', function () {
      const agent = new Agent();
      lobby.agents = [agent];

      agent.add(lobby);

      expect(agent.valid()).toBeTruthy();
    });
  });

  describe('if in lobby', function () {
    test('cannot enter lobby', function () {
      expect(() => {
        const agent = new Agent();
        agent.add(lobby);
        agent.add(lobby);

        expect(eventStore.publish).toHaveBeenCalledTimes(1);
        expect(eventStore.publish).toHaveBeenCalledWith(
          (Entered as any).mock.instances[0],
        );
      }).toThrow(AgentAlreadyInLobby);
    });

    test('can exit lobby', function () {
      const agent = new Agent();
      agent.add(lobby);
      lobby.agents = [];

      agent.remove(lobby);
      
      expect(agent.valid()).toBeTruthy();
    });

    test('can request conversation with another agent in same lobby', function () {
      const agent_one = new Agent();
      const agent_two = new Agent();

      agent_one.add(lobby);
      agent_two.add(lobby);

      agent_one.request([agent_two], lobby);

      expect(eventStore.publish).toHaveBeenCalledTimes(1);
      expect(eventStore.publish).toHaveBeenCalledWith(
        (Requested as any).mock.instances[0],
      );
    });

    test('cannot request conversation with another agent not in same lobby', function () {
      expect(() => {
        const agent_one = new Agent();
        const agent_two = new Agent();

        agent_one.request([agent_two], lobby);

        expect(eventStore.publish).toHaveBeenCalledTimes(0);
      }).toThrow(AgentNotInLobby);
    });
  });
});
