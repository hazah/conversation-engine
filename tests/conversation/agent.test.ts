jest.mock('../../src/conversation/lobby/entity');
jest.mock('../../src/conversation/event-store');

jest.mock('../../src/conversation/entered');
jest.mock('../../src/conversation/exited');

import EventStore from '../../src/conversation/event-store';
import { Agent, Lobby, eventStore } from '../../src/conversation';
import Entered from '../../src/conversation/entered';
import Exited from '../../src/conversation/exited';
import AgentNotInLobby from '../../src/conversation/agent-not-in-lobby';
import AgentAlreadyInLobby from '../../src/conversation/agent-already-in-lobby';

beforeEach(function () {
  (Lobby as any).mockClear();
  (EventStore as any).mockClear();
  (Entered as any).mockClear();
  (Exited as any).mockClear();
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
        eventStore.process_events = jest.fn(() => {
          agent.remove(lobby);
        });
        
        const agent = new Agent();
        agent.exit(lobby);

        expect(eventStore.publish).toHaveBeenCalledTimes(1);
        expect(eventStore.publish).toHaveBeenCalledWith((Exited as any).mock.instances[0]);
        expect(eventStore.process_events).toHaveBeenCalledTimes(1);
      }).toThrow(AgentNotInLobby);
    });

    test('can enter lobby', function () {
      eventStore.process_events = jest.fn(function () {
        agent.add(lobby);
      });
      
      const agent = new Agent();
      lobby.agents = [agent];
      
      agent.enter(lobby);
      expect(agent.valid()).toBeTruthy();
    });
  });

  describe('if in lobby', function () {
    test('cannot enter lobby', function () {
      expect(() => {
        eventStore.process_events = jest.fn(() => {
          agent.add(lobby);
        });
        
        const agent = new Agent();
        agent.add(lobby);
        agent.enter(lobby);

        expect(eventStore.publish).toHaveBeenCalledTimes(1);
        expect(eventStore.publish).toHaveBeenCalledWith((Entered as any).mock.instances[0]);
        expect(eventStore.process_events).toHaveBeenCalledTimes(1);
      }).toThrow(AgentAlreadyInLobby);
    });
    test('can exit lobby', function () {
      eventStore.process_events = jest.fn(function () {
        agent.remove(lobby);
      });
      
      const agent = new Agent();
      agent.add(lobby);
      lobby.agents = [];
      
      agent.exit(lobby);
      expect(agent.valid()).toBeTruthy();
    });
  });
});