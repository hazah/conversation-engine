jest.mock('../../src/conversation/agent/entity');
jest.mock('../../src/conversation/event-store');

jest.mock('../../src/conversation/entered');
jest.mock('../../src/conversation/exited');


import { eventStore, Lobby, Agent } from "../../src/conversation";
import Entered from "../../src/conversation/entered";
import EventStore from "../../src/conversation/event-store";
import Exited from "../../src/conversation/exited";
import LobbyAlreadyHasAgent from "../../src/conversation/lobby-already-has-agent";
import LobbyUnknownToAgent from "../../src/conversation/lobby-unknown-to-agent";


beforeEach(function () {
  (Agent as any).mockClear();
  (EventStore as any).mockClear();
  (Entered as any).mockClear();
  (Exited as any).mockClear();
});

describe('lobby', function () {
  let agent: any;

  beforeEach(function () {
    new Agent();
    agent = (Agent as any).mock.instances[0];
  });

  describe('when agent not in', function () {
    test('agent cannot leave', function () {
      expect(function () {
        eventStore.process_events = jest.fn(function () {
          lobby.remove(agent);
        });
        agent.exit = jest.fn(function (lobby) {
          eventStore.process_events();
        });
        
        const lobby = new Lobby();
        agent.exit(lobby);

        expect(eventStore.process_events).toHaveBeenCalledTimes(1);
      }).toThrow(LobbyUnknownToAgent);
    });

    test('agent can enter', function () {
      eventStore.process_events = jest.fn(function () {
        lobby.add(agent);
      });
      agent.enter = jest.fn(function (lobby) {
        eventStore.process_events();
      });
      
      const lobby = new Lobby();
      agent.lobbies = [lobby];
      
      agent.enter(lobby);
      expect(lobby.valid()).toBeTruthy();
    });
  });

  describe('when agent is in', function () {
    test('agent cannot enter', function () {
      expect(() => {
        eventStore.process_events = jest.fn(() => {
          lobby.add(agent);
        });
        agent.enter = jest.fn(function (lobby) {
          eventStore.process_events();
        });
        
        const lobby = new Lobby();
        lobby.add(agent);
        agent.enter(lobby);

        expect(eventStore.process_events).toHaveBeenCalledTimes(1);
      }).toThrow(LobbyAlreadyHasAgent);
    });

    test('agent can leave', function () {
      eventStore.process_events = jest.fn(function () {
        lobby.remove(agent);
      });
      agent.exit = jest.fn(function (lobby) {
        eventStore.process_events();
      });
      
      const lobby = new Lobby();
      lobby.add(agent);
      
      agent.exit(lobby);
      expect(lobby.valid()).toBeTruthy();
    });
  });
});