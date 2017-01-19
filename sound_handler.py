# Author: Samuel Resendez

import pyaudio

import numpy as np
import math
import Queue
import unirest





"""
soundHandler class, for Neil's IoT Thing
"""


class soundHandler(object):
    """pyDocs here"""

    def __init__(self, channel_number=1, rate=8000, chunk=130):
        """Initializes a soundHandler, with default values that provide 60 readings per second, scaled to output 0 - 100.
        Can be updated to set the channel_number, rate, and chunk

        channel_number: Int
        rate : Int
        chunk : Int

        """

        self.__CHANNELS = channel_number
        self.__RATE = rate
        self.__CHUNK = chunk
        self.__max_output = 100
        self.__dependency = -0.0018
        self.__scale_factor = 8
        self.stream = None
        self.__currPattern = 0
        self.__isActive = False

        self.queue = Queue.Queue()


    def close_stream(self):
        if self.__isActive:
            self.__isActive = False
        else:
            pass

    def __sigmoid(self, x):
        """Math function which maps values to set volume scale"""

        return round(self.__max_output / (1 + self.__scale_factor * math.exp(self.__dependency * x)))


    def __update_curr_pattern(self,response):

        self.__currPattern = int(response.raw_body)

    def __frequencySigmoid(self,freq):
        return round(100 / (1 + 10 * math.exp(-.0003 * freq)))

    def update_sigmoid_params(self, max_value=100, input_dependency=-0.0003, scale_factor=8):
        """Can update the values of the sigmoid function, if needed"""
        self.__max_output = max_value
        self.__dependency = input_dependency
        self.__scale_factor = scale_factor

    def is_active(self):
        return self.stream.is_active

    def __callback(self, in_data, frame_count, time_info, flag):
        """Private function used to interface with pyAudio"""
        audio_data = np.fromstring(in_data, dtype=np.int16)



        if int(frame_count) % 2 == 0 :
            url = "https://sound-visualizer-6443f.firebaseio.com/PatternID.json"
            unirest.get(url,callback=self.__update_curr_pattern)



        # do processing here
        last_volume = self.__sigmoid(max(audio_data))

        # Do the calculations
        frequency = np.fft.fft(audio_data)

        

        frequency = abs(frequency)
        frequency = np.average(frequency)
        frequency = self.__frequencySigmoid(frequency)

        self.queue.put((last_volume,frequency,self.__currPattern))

        if self.__isActive:
            return (audio_data, pyaudio.paContinue)
        else:
            return (audio_data, pyaudio.paAbort)

    def start_stream(self, callback_function):
        """Starts stream, and reads volumes values into the callback function for processing
        Callback takes one argument, which is the numeric volume data as an Integer"""
        self.__isActive = True

        self.__handle_volume_data = callback_function

        self.stream = pyaudio.PyAudio().open(format=pyaudio.paInt16,
                                             channels=self.__CHANNELS,
                                             rate=self.__RATE,
                                             frames_per_buffer=self.__CHUNK,
                                             input=True,
                                             stream_callback=self.__callback)
        self.stream.start_stream()

        while self.stream.is_active():
            self.__getBlockingFunction()

        self.stream.close()

    def __getBlockingFunction(self):
        tupleData = self.queue.get()
        self.__handle_volume_data(tupleData[0],tupleData[1],tupleData[2])


# ----- just for testing purposes ----- #

def main():

    handler = soundHandler()

    def callback(volume,frequency,pattern):
        print("This is the volume: " + str(volume))
        print("This is the frequency: " + str(frequency))
        print("This is the pattern: " + str(pattern))
        return volume

    handler.start_stream(callback_function=callback)


if __name__ == "__main__":

    main()