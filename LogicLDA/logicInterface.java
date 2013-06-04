//This requires java-ddp-client from kutrumbo, and only fascilitates messages between the database and logiclda

import java.net.URISyntaxException;
import java.util.Observer;

import me.kutrumbos.DdpClient;

import java.util.Observable;
import java.util.Observer;


public class SimpleDdpClientObserver implements Observer {

	@Override
	public void update(Observable client, Object msg) {

		if (msg instanceof String) {
			//Needs a remake of LogicLDA
		}

	}

}

public class DdpMultiClient{

	public static void main(String[] args) {

		// specify location of Meteor server (assumes it is running locally) 
		String meteorIp = "localhost";
		Integer meteorPort = 3000;

		try {

			// create DDP client instance
			DdpClient ddp = new DdpClient(meteorIp, meteorPort);

			// create DDP client observer
			Observer obs = new SimpleDdpClientObserver();

			// add observer
			ddp.addObserver(obs);

			// make connection to Meteor server
			ddp.connect();

			Thread.sleep(1000);

			ddp.subscribe("allPositions", new Object[]{});

		} catch (URISyntaxException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		

	}



}